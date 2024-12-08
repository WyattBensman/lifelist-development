import React, { createContext, useCallback, useContext, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { GET_DEVELOPING_CAMERA_SHOTS } from "../utils/queries/cameraQueries";
import {
  saveMetadataToCache,
  getMetadataFromCache,
  saveImageToFileSystem,
  deleteImageFromFileSystem,
} from "../utils/newCacheHelper";

const DevelopingRollContext = createContext();

const CACHE_KEY_DEVELOPING = "developingCameraShots";

export const DevelopingRollProvider = ({ children }) => {
  const [developingShots, setDevelopingShots] = useState([]);
  const [
    isDevelopingRollCacheInitialized,
    setIsDevelopingRollCacheInitialized,
  ] = useState(false);

  // Lazy query to fetch developing shots
  const [fetchShots] = useLazyQuery(GET_DEVELOPING_CAMERA_SHOTS, {
    fetchPolicy: "network-only",
    onCompleted: async (fetchedData) => {
      try {
        const serverShots = fetchedData?.getDevelopingCameraShots || [];

        // Save each shot's thumbnail to the file system
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
      console.error("[DevelopingRollContext] Error fetching shots:", error);
    },
  });

  // Initialize developing roll cache from local storage or fetch from server
  const initializeDevelopingRollCache = async () => {
    if (isDevelopingRollCacheInitialized) return; // Skip if already initialized

    try {
      const cachedData = await getMetadataFromCache(CACHE_KEY_DEVELOPING);

      if (cachedData) {
        setDevelopingShots(cachedData);
        setIsDevelopingRollCacheInitialized(true);
      } else {
        await fetchShots(); // Fetch fresh data if cache is empty
      }
    } catch (error) {
      console.error(
        "[DevelopingRollContext] Error initializing developing roll cache:",
        error
      );
    }
  };

  // Add a new shot to the developing roll cache
  const addShotToDevelopingRoll = async (newShot) => {
    try {
      const updatedShots = [newShot, ...developingShots];
      setDevelopingShots(updatedShots);

      // Save updated metadata and thumbnail
      await saveMetadataToCache(CACHE_KEY_DEVELOPING, updatedShots);
      const cacheKey = `developing_shot_${newShot._id}`;
      await saveImageToFileSystem(cacheKey, newShot.imageThumbnail, true);
    } catch (error) {
      console.error(
        "[DevelopingRollContext] Error adding shot to developing roll:",
        error
      );
    }
  };

  // Remove a shot from the developing roll cache
  const removeShotFromDevelopingRoll = async (shotId) => {
    try {
      const updatedShots = developingShots.filter(
        (shot) => shot._id !== shotId
      );
      setDevelopingShots(updatedShots);

      // Update metadata and delete thumbnail
      await saveMetadataToCache(CACHE_KEY_DEVELOPING, updatedShots);
      const cacheKey = `developing_shot_${shotId}`;
      await deleteImageFromFileSystem(cacheKey);
    } catch (error) {
      console.error(
        "[DevelopingRollContext] Error removing shot from developing roll:",
        error
      );
    }
  };

  // Update a shot in the developing roll cache
  const updateShotInDevelopingRoll = (shotId, updatedData) => {
    try {
      const updatedShots = developingShots.map((shot) =>
        shot._id === shotId ? { ...shot, ...updatedData } : shot
      );
      setDevelopingShots(updatedShots);

      // Update metadata
      saveMetadataToCache(CACHE_KEY_DEVELOPING, updatedShots);
    } catch (error) {
      console.error(
        "[DevelopingRollContext] Error updating shot in developing roll:",
        error
      );
    }
  };

  const recalculateDevelopedStatus = useCallback(async () => {
    try {
      const now = new Date();
      const updatedShots = developingShots.map((shot) => {
        const isDeveloped = new Date(shot.readyToReviewAt) <= now;
        return { ...shot, isDeveloped };
      });

      // Update context state only if there's a change
      if (JSON.stringify(updatedShots) !== JSON.stringify(developingShots)) {
        setDevelopingShots(updatedShots);
        await saveMetadataToCache(CACHE_KEY_DEVELOPING, updatedShots);
      }
    } catch (error) {
      console.error(
        "[DevelopingRollContext] Error recalculating status:",
        error
      );
    }
  }, [developingShots]);

  const contextValue = {
    developingShots,
    addShotToDevelopingRoll,
    removeShotFromDevelopingRoll,
    updateShotInDevelopingRoll,
    initializeDevelopingRollCache,
    isDevelopingRollCacheInitialized,
    recalculateDevelopedStatus,
  };

  return (
    <DevelopingRollContext.Provider value={contextValue}>
      {children}
    </DevelopingRollContext.Provider>
  );
};

export const useDevelopingRoll = () => useContext(DevelopingRollContext);
