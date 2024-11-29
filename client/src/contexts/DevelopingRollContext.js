import React, { createContext, useContext, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { GET_DEVELOPING_CAMERA_SHOTS } from "../utils/queries/cameraQueries";
import {
  saveMetaDataToCache,
  getMetaDataFromCache,
  saveImageToFileSystem,
  deleteImageFromFileSystem,
} from "../utils/cacheHelper";

const DevelopingRollContext = createContext();

const CACHE_KEY = "developingCameraShots";

export const DevelopingRollProvider = ({ children }) => {
  const [cachedShots, setCachedShots] = useState([]);
  const [isCacheInitialized, setIsCacheInitialized] = useState(false);

  // Lazy query to fetch developing shots
  const [fetchShots] = useLazyQuery(GET_DEVELOPING_CAMERA_SHOTS, {
    fetchPolicy: "network-only",
    onCompleted: async (fetchedData) => {
      console.log(`Fetched the Developing Shots!`);
      const serverShots = fetchedData?.getDevelopingCameraShots || [];

      console.log(serverShots);

      // Save each shot's thumbnail to the file system
      for (const shot of serverShots) {
        const cacheKey = `developing_shot_${shot._id}`;
        try {
          await saveImageToFileSystem(cacheKey, shot.imageThumbnail);
          console.log(`Saved thumbnail to file system: ${cacheKey}`);
        } catch (error) {
          console.error(
            `[DevelopingRollContext] Error saving thumbnail for ${cacheKey}:`,
            error
          );
        }
      }

      // Update state and cache metadata
      setCachedShots(serverShots);
      saveMetaDataToCache(CACHE_KEY, serverShots);
      setIsCacheInitialized(true);
    },
    onError: (error) => {
      console.error("[DevelopingRollContext] Error fetching shots:", error);
    },
  });

  // Explicitly initialize the cache
  const initializeCache = async () => {
    try {
      console.log(`Checking if Cache is Initialized`);

      if (isCacheInitialized) return; // Avoid re-initialization

      const cachedData = getMetaDataFromCache(CACHE_KEY);

      if (cachedData) {
        console.log(`There's cached data`);
        setCachedShots(cachedData);
        setIsCacheInitialized(true);
      } else {
        console.log(`There's NO cached data`);
        await fetchShots(); // Fetch fresh data if cache is empty
      }
    } catch (error) {
      console.error("[DevelopingRollContext] Error initializing cache:", error);
    }
  };

  // Add a new shot to the cache
  const addShotToCache = async (newShot) => {
    try {
      console.log("Adding shot to cache");

      setCachedShots((prevShots) => {
        const updatedShots = [...prevShots, newShot];
        saveMetaDataToCache(CACHE_KEY, updatedShots);
        return updatedShots;
      });

      const cacheKey = `developing_shot_${newShot._id}`;
      await saveImageToFileSystem(cacheKey, newShot.imageThumbnail);
      console.log(`Added Shot to Cache!`);
    } catch (error) {
      console.error(
        "[DevelopingRollContext] Error adding shot to cache:",
        error
      );
    }
  };

  // Remove a shot from the cache
  const removeShotFromCache = async (shotId) => {
    try {
      setCachedShots((prevShots) => {
        const updatedShots = prevShots.filter((shot) => shot._id !== shotId);
        saveMetaDataToCache(CACHE_KEY, updatedShots);
        return updatedShots;
      });

      const cacheKey = `developing_shot_${shotId}`;
      await deleteImageFromFileSystem(cacheKey);
      console.log(`Removed Shot from Cache!`);
    } catch (error) {
      console.error(
        "[DevelopingRollContext] Error removing shot from cache:",
        error
      );
    }
  };

  // Update a shot in the cache
  const updateShotInCache = (shotId, updatedData) => {
    try {
      setCachedShots((prevShots) => {
        const updatedShots = prevShots.map((shot) =>
          shot._id === shotId ? { ...shot, ...updatedData } : shot
        );
        saveMetaDataToCache(CACHE_KEY, updatedShots);
        return updatedShots;
      });
    } catch (error) {
      console.error(
        "[DevelopingRollContext] Error updating shot in cache:",
        error
      );
    }
  };

  const contextValue = {
    cachedShots,
    addShotToCache,
    removeShotFromCache,
    updateShotInCache,
    initializeCache,
    isCacheInitialized,
  };

  return (
    <DevelopingRollContext.Provider value={contextValue}>
      {children}
    </DevelopingRollContext.Provider>
  );
};

export const useDevelopingRoll = () => useContext(DevelopingRollContext);
