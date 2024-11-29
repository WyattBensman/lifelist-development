import React, { createContext, useContext, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { GET_ALL_CAMERA_ALBUMS } from "../utils/queries/cameraQueries";
import {
  saveMetadataToCache,
  getMetadataFromCache,
  saveImageToFileSystem,
  deleteImageFromFileSystem,
} from "../utils/newCacheHelper";

const CameraAlbumContext = createContext();

const CACHE_KEY_ALBUMS = "cameraAlbums";

export const CameraAlbumProvider = ({ children }) => {
  const [albums, setAlbums] = useState([]); // Store album metadata
  const [isAlbumCacheInitialized, setIsAlbumCacheInitialized] = useState(false); // Cache init state

  // Lazy query to fetch camera albums
  const [fetchAlbums] = useLazyQuery(GET_ALL_CAMERA_ALBUMS, {
    fetchPolicy: "network-only",
    onCompleted: async (fetchedData) => {
      try {
        const fetchedAlbums = fetchedData?.getAllCameraAlbums || [];
        setAlbums(fetchedAlbums);
        await saveMetadataToCache(CACHE_KEY_ALBUMS, fetchedAlbums);
        setIsAlbumCacheInitialized(true);

        // Save cover images to the file system
        for (const album of fetchedAlbums) {
          const cacheKey = `camera_album_${album._id}`;
          await saveImageToFileSystem(cacheKey, album.coverImage);
        }
      } catch (error) {
        console.error(
          "[CameraAlbumContext] Error processing fetched albums:",
          error
        );
      }
    },
    onError: (error) => {
      console.error("[CameraAlbumContext] Error fetching albums:", error);
    },
  });

  // Initialize album cache from local storage or refetch
  const initializeAlbumCache = async () => {
    if (isAlbumCacheInitialized) return; // Skip if already initialized

    try {
      const cachedData = await getMetadataFromCache(CACHE_KEY_ALBUMS);

      if (cachedData) {
        setAlbums(cachedData);
        setIsAlbumCacheInitialized(true);
      } else {
        await fetchAlbums(); // Fetch fresh data if cache is empty
      }
    } catch (error) {
      console.error(
        "[CameraAlbumContext] Error initializing album cache:",
        error
      );
    }
  };

  // Add a new album to the cache
  const addAlbumToCache = async (newAlbum) => {
    try {
      const updatedAlbums = [newAlbum, ...albums];
      setAlbums(updatedAlbums);
      await saveMetadataToCache(CACHE_KEY_ALBUMS, updatedAlbums);

      const cacheKey = `camera_album_${newAlbum._id}`;
      await saveImageToFileSystem(cacheKey, newAlbum.coverImage);
    } catch (error) {
      console.error("[CameraAlbumContext] Error adding album to cache:", error);
    }
  };

  // Remove an album from the cache
  const removeAlbumFromCache = async (albumId) => {
    try {
      const updatedAlbums = albums.filter((album) => album._id !== albumId);
      setAlbums(updatedAlbums);
      await saveMetadataToCache(CACHE_KEY_ALBUMS, updatedAlbums);

      const cacheKey = `camera_album_${albumId}`;
      await deleteImageFromFileSystem(cacheKey);
    } catch (error) {
      console.error(
        "[CameraAlbumContext] Error removing album from cache:",
        error
      );
    }
  };

  // Update an album in the cache
  const updateAlbumInCache = async (albumId, updatedData) => {
    try {
      const updatedAlbums = albums.map((album) =>
        album._id === albumId ? { ...album, ...updatedData } : album
      );
      setAlbums(updatedAlbums);
      await saveMetadataToCache(CACHE_KEY_ALBUMS, updatedAlbums);
    } catch (error) {
      console.error(
        "[CameraAlbumContext] Error updating album in cache:",
        error
      );
    }
  };

  const contextValue = {
    albums,
    addAlbumToCache,
    removeAlbumFromCache,
    updateAlbumInCache,
    initializeAlbumCache,
    isAlbumCacheInitialized,
  };

  return (
    <CameraAlbumContext.Provider value={contextValue}>
      {children}
    </CameraAlbumContext.Provider>
  );
};

export const useCameraAlbums = () => useContext(CameraAlbumContext);
