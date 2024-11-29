import React, { createContext, useContext, useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_ALL_CAMERA_SHOTS } from "../utils/queries/cameraQueries";
import {
  saveMetadataToCache,
  getMetadataFromCache,
  saveImageToFileSystem,
  getImageFromFileSystem,
  deleteImageFromFileSystem,
} from "../utils/newCacheHelper";
import LRUCache from "../utils/LRUCache";

const CameraRollContext = createContext();

const CACHE_KEY_METADATA = "cameraRollMetadata";
const DOCUMENT_THUMBNAIL_LIMIT = 24; // Persistent thumbnails limit
const FULL_RESOLUTION_CACHE_LIMIT = 16; // Max full-resolution images in memory

const fullResolutionCache = new LRUCache(FULL_RESOLUTION_CACHE_LIMIT);

export const CameraRollProvider = ({ children }) => {
  const [shots, setShots] = useState([]); // Camera shots
  const [nextCursor, setNextCursor] = useState(null); // For pagination
  const [hasNextPage, setHasNextPage] = useState(true); // Pagination state
  const [isCameraRollCacheInitialized, setIsCameraRollCacheInitialized] =
    useState(false); // Cache init state

  const { refetch: fetchShots } = useQuery(GET_ALL_CAMERA_SHOTS, {
    skip: true, // Skip running automatically, use refetch instead
  });

  // Initialize shots from cache or fetch from server
  const initializeCameraRollCache = async () => {
    console.log(`Running: ${initializeCameraRollCache}`);

    if (isCameraRollCacheInitialized) return;

    try {
      const cachedData = await getMetadataFromCache(CACHE_KEY_METADATA);
      if (cachedData) {
        console.log(`Reusing Cache: ${cachedData}`);
        setShots(cachedData.shots);
        setNextCursor(cachedData.nextCursor);
        setHasNextPage(cachedData.hasNextPage);
      } else {
        console.log(`Load new Cache`);
        await loadNextPage(); // Fetch the first page
      }
      setIsCameraRollCacheInitialized(true);
    } catch (error) {
      console.error("Error initializing camera roll cache:", error);
    }
  };

  // Load the next page of shots
  const loadNextPage = async () => {
    if (!hasNextPage) return; // No more pages to fetch

    try {
      const { data } = await fetchShots({ cursor: nextCursor, limit: 12 });

      const newShots = data.getAllCameraShots.shots;
      const newCursor = data.getAllCameraShots.nextCursor;
      const newHasNextPage = data.getAllCameraShots.hasNextPage;

      const mergedShots = [...shots, ...newShots];
      setShots(mergedShots);
      setNextCursor(newCursor);
      setHasNextPage(newHasNextPage);

      // Save updated shots to persistent storage
      await saveMetadataToCache(CACHE_KEY_METADATA, {
        shots: mergedShots,
        nextCursor: newCursor,
        hasNextPage: newHasNextPage,
      });

      // Save thumbnails for the first 24 shots
      for (
        let i = shots.length;
        i < Math.min(mergedShots.length, DOCUMENT_THUMBNAIL_LIMIT);
        i++
      ) {
        const shot = mergedShots[i];
        const thumbnailKey = `thumbnail_${shot._id}`;
        await saveImageToFileSystem(thumbnailKey, shot.imageThumbnail, true); // Save to DOCUMENT_DIR
      }
    } catch (error) {
      console.error("Error loading next page of shots:", error);
    }
  };

  // Fetch a full-resolution image with LRU caching
  const getFullResolutionImage = async (shotId, fetchImageFn) => {
    let imagePath = fullResolutionCache.get(shotId);

    if (!imagePath) {
      imagePath = await getImageFromFileSystem(shotId);
      if (!imagePath) {
        imagePath = await fetchImageFn(shotId);
        await saveImageToFileSystem(shotId, imagePath, false); // Save to CACHE_DIR
      }
      fullResolutionCache.put(shotId, imagePath);
    }

    return imagePath;
  };

  // Add a new shot to the camera roll
  const addShotToRoll = async (newShot) => {
    const updatedShots = [newShot, ...shots];
    setShots(updatedShots);

    await saveMetadataToCache(CACHE_KEY_METADATA, {
      shots: updatedShots,
      nextCursor,
      hasNextPage,
    });

    const thumbnailKey = `thumbnail_${newShot._id}`;
    if (updatedShots.length <= DOCUMENT_THUMBNAIL_LIMIT) {
      await saveImageToFileSystem(thumbnailKey, newShot.imageThumbnail, true); // Save to DOCUMENT_DIR
    } else {
      await saveImageToFileSystem(thumbnailKey, newShot.imageThumbnail, false); // Save to CACHE_DIR
    }
  };

  // Remove a shot from the camera roll
  const removeShotFromRoll = async (shotId) => {
    const updatedShots = shots.filter((shot) => shot._id !== shotId);
    setShots(updatedShots);

    await saveMetadataToCache(CACHE_KEY_METADATA, {
      shots: updatedShots,
      nextCursor,
      hasNextPage,
    });

    const thumbnailKey = `thumbnail_${shotId}`;
    await deleteImageFromFileSystem(thumbnailKey);
  };

  // Update metadata for a shot
  const updateShotMetadata = (shotId, updates) => {
    const updatedShots = shots.map((shot) =>
      shot._id === shotId ? { ...shot, ...updates } : shot
    );
    setShots(updatedShots);

    saveMetadataToCache(CACHE_KEY_METADATA, {
      shots: updatedShots,
      nextCursor,
      hasNextPage,
    });
  };

  const contextValue = {
    shots,
    loadNextPage,
    getFullResolutionImage,
    addShotToRoll,
    removeShotFromRoll,
    updateShotMetadata,
    initializeCameraRollCache,
    isCameraRollCacheInitialized,
  };

  return (
    <CameraRollContext.Provider value={contextValue}>
      {children}
    </CameraRollContext.Provider>
  );
};

export const useCameraRoll = () => useContext(CameraRollContext);
