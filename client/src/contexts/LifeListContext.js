import React, { createContext, useContext, useState } from "react";
import {
  saveMetadataToCache,
  getMetadataFromCache,
  saveImageToFileSystem,
  deleteImageFromFileSystem,
} from "../utils/newCacheHelper";
import { useLazyQuery, useMutation } from "@apollo/client";
import { GET_USER_LIFELIST } from "../utils/queries/lifeListQueries";
import {
  ADD_LIFELIST_EXPERIENCE,
  REMOVE_LIFELIST_EXPERIENCE,
  UPDATE_LIFELIST_EXPERIENCE,
} from "../utils/mutations/lifelistMutations";
import { useAuth } from "./AuthContext";

const LifeListContext = createContext();

const CACHE_KEY_LIFELIST = (userId) => `lifelist_${userId}`;
const CACHE_KEY_LIFELIST_IMAGE_PREFIX = "experience_image_";

export const LifeListProvider = ({ children }) => {
  const [lifeLists, setLifeLists] = useState({}); // Store LifeLists by userId
  const [isLifeListCacheInitialized, setIsLifeListCacheInitialized] = useState(
    {}
  ); // Track cache initialization per userId
  const { currentUser } = useAuth();

  const [fetchLifeList] = useLazyQuery(GET_USER_LIFELIST);
  const [addLifeListExperience] = useMutation(ADD_LIFELIST_EXPERIENCE);
  const [updateLifeListExperience] = useMutation(UPDATE_LIFELIST_EXPERIENCE);
  const [removeLifeListExperience] = useMutation(REMOVE_LIFELIST_EXPERIENCE);

  // === Initialize LifeList Cache ===
  const initializeLifeListCache = async (
    userId,
    isAdmin = false,
    limit = 12
  ) => {
    if (isLifeListCacheInitialized[userId]) return; // Skip if already initialized

    try {
      const cacheKey = CACHE_KEY_LIFELIST(userId);
      const isPersistent = isAdmin;

      // Load metadata from the cache
      const cachedLifeList = await getMetadataFromCache(cacheKey, isPersistent);

      if (cachedLifeList) {
        console.log(
          `[LifeListContext] Loaded LifeList for ${userId} from cache.`
        );
        setLifeLists((prev) => ({ ...prev, [userId]: cachedLifeList }));
        setIsLifeListCacheInitialized((prev) => ({ ...prev, [userId]: true }));
        return;
      }

      // Fetch LifeList from server
      const { data } = await fetchLifeList({ variables: { userId, limit } });
      const fetchedLifeList = data?.getUserLifeList;
      console.log("Fetched LifeList from server:", fetchedLifeList);

      if (fetchedLifeList) {
        console.log(
          `[LifeListContext] Fetched LifeList for ${userId} from server.`
        );
        await cacheLifeList(userId, fetchedLifeList, isAdmin);
      }

      setIsLifeListCacheInitialized((prev) => ({ ...prev, [userId]: true }));
    } catch (error) {
      console.error(
        `[LifeListContext] Error initializing LifeList cache:`,
        error
      );
      setIsLifeListCacheInitialized((prev) => ({ ...prev, [userId]: false }));
    }
  };

  // === Cache LifeList ===
  const cacheLifeList = async (userId, lifeList, isAdmin) => {
    try {
      const isPersistent = isAdmin;

      // Add metadata for caching
      const experiences = lifeList.experiences.map((exp) => ({
        ...exp,
        associatedShots: exp.associatedShots.map((shot) => ({
          _id: shot._id,
          capturedAt: shot.capturedAt,
          image: shot.image,
          imageThumbnail: shot.imageThumbnail,
        })),
      }));

      const lifeListToCache = { ...lifeList, experiences };

      // Save to cache
      await saveMetadataToCache(
        CACHE_KEY_LIFELIST(userId),
        lifeListToCache,
        isPersistent
      );

      // Cache images for experiences
      await cacheImages(experiences, isAdmin);

      // Update context
      setLifeLists((prev) => ({ ...prev, [userId]: lifeListToCache }));
      console.log(`[LifeListContext] Cached LifeList for user ${userId}.`);
    } catch (error) {
      console.error(`[LifeListContext] Error caching LifeList:`, error);
    }
  };

  // === Cache Images Helper ===
  const cacheImages = async (experiences, isAdmin) => {
    for (let i = 0; i < experiences.length; i++) {
      const { experience } = experiences[i];
      const isDocumentDir = isAdmin && i < 12; // Admin: First 12 in documentDirectory
      const cacheKey = `${CACHE_KEY_LIFELIST_IMAGE_PREFIX}${experience._id}`;
      await saveImageToFileSystem(cacheKey, experience.image, isDocumentDir);
    }
  };

  // === Add LifeList Experience(s) ===
  const addLifeListExperienceToCache = async (newItems, isAdmin) => {
    try {
      const itemsToProcess = Array.isArray(newItems) ? newItems : [newItems];
      const addedItems = [];

      for (const newItem of itemsToProcess) {
        console.log("Adding new item:", newItem);

        // Transform associatedShots to IDs
        const shotIds = newItem.associatedShots?.map((shot) => shot._id) || [];

        const { data } = await addLifeListExperience({
          variables: {
            lifeListId: newItem.lifeListId,
            experienceId: newItem.experience._id,
            list: newItem.list,
            associatedShots: shotIds, // Pass IDs only
          },
        });

        if (data?.addLifeListExperience?.success) {
          const lifeListExperienceId =
            data.addLifeListExperience.lifeListExperienceId;

          console.log("Added LifeListExperience:", lifeListExperienceId);

          // Transform the new item for local caching
          const transformedNewItem = {
            __typename: "LifeListExperienceWithDetails",
            _id: lifeListExperienceId, // Use the returned ID from the server
            experience: newItem.experience,
            associatedShots: newItem.associatedShots || [],
            hasAssociatedShots: Boolean(newItem.associatedShots?.length),
            list: newItem.list,
          };

          addedItems.push(transformedNewItem);
        }
      }

      if (addedItems.length > 0) {
        // Update local state with all added experiences
        setLifeLists((prev) => ({
          ...prev,
          [currentUser]: {
            ...prev[currentUser],
            experiences: [
              ...addedItems, // Add all newly added experiences
              ...(prev[currentUser]?.experiences || []), // Retain existing experiences
            ],
          },
        }));

        // Cache the updated LifeList
        await cacheLifeList(
          currentUser,
          {
            ...lifeLists[currentUser],
            experiences: [
              ...addedItems,
              ...(lifeLists[currentUser]?.experiences || []),
            ],
          },
          isAdmin
        );

        console.log(
          "Updated LifeList after adding multiple items:",
          lifeLists[currentUser]
        );
      }
    } catch (error) {
      console.error(
        `[LifeListContext] Error adding experience(s) to LifeList:`,
        error
      );
    }
  };

  // === Update LifeList Experience ===
  const updateLifeListExperienceInCache = async (updatedItem, isAdmin) => {
    try {
      console.log("Updated item:", updatedItem);

      // Extract IDs from associatedShots for the mutation
      const shotIds =
        updatedItem.associatedShots?.map((shot) => shot._id) || [];
      console.log("lifeListExperienceId:", updatedItem.lifeListExperienceId);
      console.log("shotIds:", shotIds);

      const { data } = await updateLifeListExperience({
        variables: {
          lifeListExperienceId: updatedItem.lifeListExperienceId,
          list: updatedItem.list, // This may be undefined
          associatedShots: shotIds, // Pass IDs to the mutation
        },
      });

      if (data?.updateLifeListExperience?.success) {
        // Update local state with merged data
        const updatedExperiences = lifeLists[currentUser].experiences.map(
          (exp) =>
            exp._id === updatedItem.lifeListExperienceId
              ? {
                  ...exp, // Keep existing fields
                  list: updatedItem.list ?? exp.list, // Preserve existing list if not passed
                  associatedShots:
                    updatedItem.associatedShots || exp.associatedShots, // Update associatedShots if provided
                  hasAssociatedShots: Boolean(
                    updatedItem.associatedShots?.length ||
                      exp.associatedShots?.length
                  ), // Update hasAssociatedShots
                }
              : exp
        );

        const updatedLifeList = {
          ...lifeLists[currentUser],
          experiences: updatedExperiences,
        };

        console.log("Updated LifeList:", updatedLifeList);

        // Cache the updated LifeList
        await cacheLifeList(currentUser, updatedLifeList, isAdmin);
      }
    } catch (error) {
      console.error(
        `[LifeListContext] Error updating experience in LifeList:`,
        error
      );
    }
  };

  // === Remove LifeList Experience ===
  const removeLifeListExperienceFromCache = async (
    lifeListExperienceId,
    isAdmin
  ) => {
    try {
      const { data } = await removeLifeListExperience({
        variables: {
          lifeListId: lifeLists[currentUser]._id,
          lifeListExperienceId,
        },
      });

      if (data?.removeLifeListExperience?.success) {
        const updatedExperiences = lifeLists[currentUser].experiences.filter(
          (exp) => exp._id !== lifeListExperienceId
        );

        const updatedLifeList = {
          ...lifeLists[currentUser],
          experiences: updatedExperiences,
        };

        await cacheLifeList(currentUser, updatedLifeList, isAdmin);

        // Remove cached image
        const cacheKey = `${CACHE_KEY_LIFELIST_IMAGE_PREFIX}${lifeListExperienceId}`;
        await deleteImageFromFileSystem(cacheKey);
      }
    } catch (error) {
      console.error(
        `[LifeListContext] Error removing experience from LifeList:`,
        error
      );
    }
  };

  // Update associated shots in the cache and server
  const updateAssociatedShotsInCache = async (experienceId, updatedShots) => {
    try {
      // Find the experience and update its associated shots
      const updatedExperiences = lifeLists[currentUser].experiences.map((exp) =>
        exp._id === experienceId
          ? { ...exp, associatedShots: updatedShots }
          : exp
      );

      // Update the cache
      const updatedLifeList = {
        ...lifeLists[currentUser],
        experiences: updatedExperiences,
      };

      await cacheLifeList(currentUser, updatedLifeList, true);

      // Update the local state
      setLifeLists((prev) => ({
        ...prev,
        [currentUser]: updatedLifeList,
      }));

      console.log("[LifeListContext] Updated associated shots in cache.");
    } catch (error) {
      console.error(
        "[LifeListContext] Error updating associated shots in cache:",
        error
      );
    }
  };

  const resetLifeListState = () => {
    setLifeLists({});
    setIsLifeListCacheInitialized({});
  };

  const contextValue = {
    lifeLists,
    isLifeListCacheInitialized,
    initializeLifeListCache,
    addLifeListExperienceToCache,
    updateLifeListExperienceInCache,
    removeLifeListExperienceFromCache,
    updateAssociatedShotsInCache,
    resetLifeListState,
  };

  return (
    <LifeListContext.Provider value={contextValue}>
      {children}
    </LifeListContext.Provider>
  );
};

export const useLifeList = () => useContext(LifeListContext);
