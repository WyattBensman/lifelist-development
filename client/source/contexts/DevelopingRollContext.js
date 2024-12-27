import React, { createContext, useCallback, useContext, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { GET_DEVELOPING_CAMERA_SHOTS } from "../utils/queries/cameraQueries";
import {
  saveMetadataToCache,
  getMetadataFromCache,
  saveImageToFileSystem,
  deleteImageFromFileSystem,
} from "../utils/cacheHelper";

const DevelopingRollContext = createContext();

// Cache Key Constants
const CACHE_KEY_DEVELOPING = "developingCameraShots";

export const DevelopingRollProvider = ({ children }) => {
  const [developingShots, setDevelopingShots] = useState([]);
  const [
    isDevelopingRollCacheInitialized,
    setIsDevelopingRollCacheInitialized,
  ] = useState(false);

  // Fetch developing shots from the server
  const [fetchDevelopingShots] = useLazyQuery(GET_DEVELOPING_CAMERA_SHOTS, {
    fetchPolicy: "network-only",
    onCompleted: async (data) => {
      try {
        const serverShots = data?.getDevelopingCameraShots || [];

        // Cache thumbnails for each shot
        for (const shot of serverShots) {
          const cacheKey = `developing_shot_${shot._id}`;
          await saveImageToFileSystem(cacheKey, shot.imageThumbnail, true); // Save to DOCUMENT_DIR
        }

        // Update state and cache metadata
        setDevelopingShots(serverShots);
        await saveMetadataToCache(CACHE_KEY_DEVELOPING, serverShots);
        setIsDevelopingRollCacheInitialized(true);
      } catch (error) {
        console.error(
          "[DevelopingRollContext] Error processing fetched shots:",
          error
        );
      }
    },
    onError: (error) => {
      console.error(
        "[DevelopingRollContext] Error fetching developing shots:",
        error
      );
    },
  });

  // Initialize developing roll from cache or fetch from the server
  const initializeDevelopingRoll = async () => {
    if (isDevelopingRollCacheInitialized) return; // Skip if already initialized

    try {
      const cachedShots = await getMetadataFromCache(CACHE_KEY_DEVELOPING);

      if (cachedShots) {
        setDevelopingShots(cachedShots);
        setIsDevelopingRollCacheInitialized(true);
      } else {
        await fetchDevelopingShots(); // Fetch data if no cache available
      }
    } catch (error) {
      console.error("[DevelopingRollContext] Error initializing cache:", error);
    }
  };

  // Add a new shot to the developing roll
  const addShot = async (newShot) => {
    try {
      const updatedShots = [newShot, ...developingShots];
      setDevelopingShots(updatedShots);

      // Cache metadata and thumbnail
      await saveMetadataToCache(CACHE_KEY_DEVELOPING, updatedShots);
      const cacheKey = `developing_shot_${newShot._id}`;
      await saveImageToFileSystem(cacheKey, newShot.imageThumbnail, true);
    } catch (error) {
      console.error("[DevelopingRollContext] Error adding shot:", error);
    }
  };

  // Remove a shot from the developing roll
  const removeShot = async (shotId) => {
    try {
      const updatedShots = developingShots.filter(
        (shot) => shot._id !== shotId
      );
      setDevelopingShots(updatedShots);

      // Update cache and delete thumbnail
      await saveMetadataToCache(CACHE_KEY_DEVELOPING, updatedShots);
      const cacheKey = `developing_shot_${shotId}`;
      await deleteImageFromFileSystem(cacheKey);
    } catch (error) {
      console.error("[DevelopingRollContext] Error removing shot:", error);
    }
  };

  // Update a shot's metadata
  const updateShot = (shotId, updates) => {
    try {
      const updatedShots = developingShots.map((shot) =>
        shot._id === shotId ? { ...shot, ...updates } : shot
      );
      setDevelopingShots(updatedShots);

      // Update cache metadata
      saveMetadataToCache(CACHE_KEY_DEVELOPING, updatedShots);
    } catch (error) {
      console.error("[DevelopingRollContext] Error updating shot:", error);
    }
  };

  // Recalculate the developed status for each shot
  const recalculateDevelopedStatus = useCallback(async () => {
    try {
      const now = new Date();
      const updatedShots = developingShots.map((shot) => ({
        ...shot,
        isDeveloped: new Date(shot.readyToReviewAt) <= now,
      }));

      // Only update if there's a change
      if (JSON.stringify(updatedShots) !== JSON.stringify(developingShots)) {
        setDevelopingShots(updatedShots);
        await saveMetadataToCache(CACHE_KEY_DEVELOPING, updatedShots);
      }
    } catch (error) {
      console.error(
        "[DevelopingRollContext] Error recalculating statuses:",
        error
      );
    }
  }, [developingShots]);

  // Reset developing roll state
  const resetDevelopingRoll = () => {
    setDevelopingShots([]);
    setIsDevelopingRollCacheInitialized(false);
  };

  const contextValue = {
    developingShots,
    addShot,
    removeShot,
    updateShot,
    initializeDevelopingRoll,
    isDevelopingRollCacheInitialized,
    recalculateDevelopedStatus,
    resetDevelopingRoll,
  };

  return (
    <DevelopingRollContext.Provider value={contextValue}>
      {children}
    </DevelopingRollContext.Provider>
  );
};

// Custom hook to access DevelopingRollContext
export const useDevelopingRoll = () => useContext(DevelopingRollContext);
