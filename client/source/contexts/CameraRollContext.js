import React, { createContext, useContext, useState } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import {
  GET_ALL_CAMERA_ALBUMS,
  GET_CAMERA_ALBUM,
} from "../utils/queries/cameraQueries";

import {
  saveMetadataToCache,
  getMetadataFromCache,
  saveImageToFileSystem,
  getImageFromFileSystem,
} from "../utils/newCacheHelper";
import {
  CREATE_CAMERA_ALBUM,
  DELETE_CAMERA_ALBUM,
  UPDATE_ALBUM_SHOTS,
} from "../utils/mutations";

const CameraAlbumContext = createContext();

const CACHE_KEY_ALBUMS = "cameraAlbums";
const CACHE_KEY_SHOTS_PREFIX = "camera_album_shots_";
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes in milliseconds

export const CameraAlbumProvider = ({ children }) => {
  const [albums, setAlbums] = useState([]);
  const [albumShotsCache, setAlbumShotsCache] = useState({});
  const [isAlbumCacheInitialized, setIsAlbumCacheInitialized] = useState(false);

  const [fetchAlbums] = useLazyQuery(GET_ALL_CAMERA_ALBUMS, {
    fetchPolicy: "network-only",
    onCompleted: async (fetchedData) => {
      const fetchedAlbums = fetchedData?.getAllCameraAlbums || [];
      setAlbums(fetchedAlbums);

      await saveMetadataToCache(CACHE_KEY_ALBUMS, fetchedAlbums);

      // Cache album cover images
      for (const album of fetchedAlbums) {
        const cacheKey = `camera_album_${album._id}`;
        if (!(await getImageFromFileSystem(cacheKey))) {
          await saveImageToFileSystem(cacheKey, album.coverImage, true);
        }
      }

      setIsAlbumCacheInitialized(true);
    },
    onError: (error) => {
      console.error("[CameraAlbumContext] Error fetching albums:", error);
    },
  });

  const [fetchAlbumShots] = useLazyQuery(GET_CAMERA_ALBUM, {
    fetchPolicy: "network-only",
  });

  const [updateAlbumShots] = useMutation(UPDATE_ALBUM_SHOTS);
  const [deleteAlbum] = useMutation(DELETE_CAMERA_ALBUM);
  const [createAlbum] = useMutation(CREATE_CAMERA_ALBUM);

  // Initialize album cache
  const initializeAlbumCache = async () => {
    if (isAlbumCacheInitialized) return;

    try {
      const cachedData = await getMetadataFromCache(CACHE_KEY_ALBUMS);

      if (cachedData) {
        setAlbums(cachedData);
        setIsAlbumCacheInitialized(true);
      } else {
        await fetchAlbums();
      }
    } catch (error) {
      console.error(
        "[CameraAlbumContext] Error initializing album cache:",
        error
      );
    }
  };

  // Check cache validity based on TTL
  const isCacheValid = (timestamp) => {
    return Date.now() - timestamp < CACHE_TTL;
  };

  // Fetch and cache paginated shots for a specific album
  const fetchPaginatedAlbumShots = async (
    albumId,
    cursor = null,
    limit = 12
  ) => {
    if (!albumId) {
      console.error("[CameraAlbumContext] Invalid albumId provided.");
      return { shots: [], nextCursor: null, hasNextPage: false };
    }

    const cacheKey = `${CACHE_KEY_SHOTS_PREFIX}${albumId}`;
    try {
      const cachedData = await getMetadataFromCache(cacheKey);

      // Validate cache TTL
      if (cachedData && isCacheValid(cachedData.timestamp)) {
        console.log(
          "[CameraAlbumContext] Using valid cache for album:",
          albumId
        );
        return {
          shots: cachedData.shots,
          nextCursor: cachedData.nextCursor,
          hasNextPage: cachedData.hasNextPage,
        };
      }

      console.log(
        "[CameraAlbumContext] Cache expired or not found. Fetching from server."
      );
      const { data } = await fetchAlbumShots({
        variables: { albumId, cursor, limit },
      });

      if (!data?.getCameraAlbum) {
        console.warn(
          "[CameraAlbumContext] No album data returned from server."
        );
        return { shots: [], nextCursor: null, hasNextPage: false };
      }

      const { shots, nextCursor, hasNextPage } = data.getCameraAlbum;

      // Merge shots to avoid duplicates
      const mergedShots = [
        ...(cachedData?.shots || []),
        ...shots.filter(
          (shot) => !cachedData?.shots?.some((s) => s._id === shot._id)
        ),
      ];

      setAlbumShotsCache((prev) => ({ ...prev, [albumId]: mergedShots }));

      // Save shots and timestamp to cache
      await saveMetadataToCache(cacheKey, {
        shots: mergedShots,
        timestamp: Date.now(),
        nextCursor,
        hasNextPage,
      });

      // Cache thumbnails for fetched shots
      for (const shot of shots) {
        const thumbnailKey = `thumbnail_${shot._id}`;
        if (!(await getImageFromFileSystem(thumbnailKey))) {
          await saveImageToFileSystem(thumbnailKey, shot.imageThumbnail, true);
        }
      }

      return { shots: mergedShots, nextCursor, hasNextPage };
    } catch (error) {
      console.error("[CameraAlbumContext] Error fetching album shots:", error);
      return { shots: [], nextCursor: null, hasNextPage: false };
    }
  };

  // Other methods (addAlbumToCache, removeAlbumFromCache, updateAlbumShotsInCache, etc.) remain unchanged.

  const resetCameraAlbumState = () => {
    setAlbums([]);
    setAlbumShotsCache({});
    setIsAlbumCacheInitialized(false);
  };

  const contextValue = {
    albums,
    albumShotsCache,
    fetchAlbums,
    addAlbumToCache,
    removeAlbumFromCache,
    updateAlbumShotsInCache,
    fetchPaginatedAlbumShots,
    initializeAlbumCache,
    isAlbumCacheInitialized,
    resetCameraAlbumState,
  };

  return (
    <CameraAlbumContext.Provider value={contextValue}>
      {children}
    </CameraAlbumContext.Provider>
  );
};

export const useCameraAlbums = () => useContext(CameraAlbumContext);
