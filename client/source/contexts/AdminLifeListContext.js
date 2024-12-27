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

const AdminLifeListContext = createContext();

const CACHE_KEY_LIFELIST = "lifelist";
const CACHE_KEY_LIFELIST_IMAGE_PREFIX = "experience_image_";

export const AdminLifeListProvider = ({ children }) => {
  const [lifeList, setLifeList] = useState(null); // Store the current user's LifeList
  const [isLifeListCacheInitialized, setIsLifeListCacheInitialized] =
    useState(false);

  const { currentUser } = useAuth(); // Use the authenticated current user

  const [fetchLifeList] = useLazyQuery(GET_USER_LIFELIST);
  const [addLifeListExperience] = useMutation(ADD_LIFELIST_EXPERIENCE);
  const [updateLifeListExperience] = useMutation(UPDATE_LIFELIST_EXPERIENCE);
  const [removeLifeListExperience] = useMutation(REMOVE_LIFELIST_EXPERIENCE);

  // === Initialize LifeList Cache ===
  const initializeLifeListCache = async (limit = 12) => {
    if (isLifeListCacheInitialized) return;

    try {
      const cacheKey = CACHE_KEY_LIFELIST;

      // Load metadata from the cache
      const cachedLifeList = await getMetadataFromCache(cacheKey, true);

      if (cachedLifeList) {
        console.log("[AdminLifeListContext] Loaded LifeList from cache.");
        setLifeList(cachedLifeList);
        await cacheImagesToDocumentDirectory(cachedLifeList.experiences);
        setIsLifeListCacheInitialized(true);
        return;
      }

      // Fetch LifeList from server
      const { data } = await fetchLifeList({
        variables: { userId: currentUser, limit },
      });

      const fetchedLifeList = data?.getUserLifeList;
      console.log("Fetched LifeList from server:", fetchedLifeList);

      if (fetchedLifeList) {
        console.log("[AdminLifeListContext] Fetched LifeList from server.");
        await cacheLifeList(fetchedLifeList);
        setLifeList(fetchedLifeList);
      }

      setIsLifeListCacheInitialized(true);
    } catch (error) {
      console.error(
        "[AdminLifeListContext] Error initializing LifeList cache:",
        error
      );
      setIsLifeListCacheInitialized(false);
    }
  };

  // === Cache LifeList ===
  const cacheLifeList = async (lifeList) => {
    try {
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
      await saveMetadataToCache(CACHE_KEY_LIFELIST, lifeListToCache, true);

      // Cache images for experiences to the document directory
      await cacheImagesToDocumentDirectory(experiences);

      console.log("[AdminLifeListContext] Cached LifeList.");
    } catch (error) {
      console.error("[AdminLifeListContext] Error caching LifeList:", error);
    }
  };

  // === Cache Images Helper ===
  const cacheImagesToDocumentDirectory = async (experiences) => {
    try {
      for (const exp of experiences) {
        const cacheKey = `${CACHE_KEY_LIFELIST_IMAGE_PREFIX}${exp._id}`;
        await saveImageToFileSystem(cacheKey, exp.image, true); // Always store in document directory
      }
      console.log(
        "[AdminLifeListContext] Cached all images to document directory."
      );
    } catch (error) {
      console.error(
        "[AdminLifeListContext] Error caching images to document directory:",
        error
      );
    }
  };

  // === Add LifeList Experience ===
  const addLifeListExperienceToCache = async (newExperience) => {
    try {
      console.log("Adding new experience:", newExperience);

      // Transform associatedShots to IDs
      const shotIds =
        newExperience.associatedShots?.map((shot) => shot._id) || [];

      const { data } = await addLifeListExperience({
        variables: {
          lifeListId: lifeList._id,
          experienceId: newExperience.experience._id,
          list: newExperience.list,
          associatedShots: shotIds, // Pass IDs only
        },
      });

      if (data?.addLifeListExperience?.success) {
        const lifeListExperienceId =
          data.addLifeListExperience.lifeListExperienceId;

        // Transform the new experience for local caching
        const transformedNewExperience = {
          ...newExperience,
          _id: lifeListExperienceId,
          hasAssociatedShots: Boolean(newExperience.associatedShots?.length),
        };

        // Update local state
        const updatedExperiences = [
          transformedNewExperience,
          ...lifeList.experiences,
        ];
        const updatedLifeList = {
          ...lifeList,
          experiences: updatedExperiences,
        };

        setLifeList(updatedLifeList);

        // Cache updated LifeList and images
        await cacheLifeList(updatedLifeList);

        console.log("Updated LifeList after adding experience.");
      }
    } catch (error) {
      console.error(
        "[AdminLifeListContext] Error adding experience to LifeList:",
        error
      );
    }
  };

  // === Update LifeList Experience ===
  const updateLifeListExperienceInCache = async (updatedExperience) => {
    try {
      console.log("Updating experience:", updatedExperience);

      const shotIds =
        updatedExperience.associatedShots?.map((shot) => shot._id) || [];

      const { data } = await updateLifeListExperience({
        variables: {
          lifeListExperienceId: updatedExperience._id,
          list: updatedExperience.list,
          associatedShots: shotIds,
        },
      });

      if (data?.updateLifeListExperience?.success) {
        const updatedExperiences = lifeList.experiences.map((exp) =>
          exp._id === updatedExperience._id
            ? { ...exp, ...updatedExperience }
            : exp
        );

        const updatedLifeList = {
          ...lifeList,
          experiences: updatedExperiences,
        };

        setLifeList(updatedLifeList);

        // Cache updated LifeList and images
        await cacheLifeList(updatedLifeList);

        console.log("Updated LifeList after updating experience.");
      }
    } catch (error) {
      console.error(
        "[AdminLifeListContext] Error updating experience in LifeList:",
        error
      );
    }
  };

  // === Remove LifeList Experience ===
  const removeLifeListExperienceFromCache = async (lifeListExperienceId) => {
    try {
      const { data } = await removeLifeListExperience({
        variables: {
          lifeListId: lifeList._id,
          lifeListExperienceId,
        },
      });

      if (data?.removeLifeListExperience?.success) {
        const updatedExperiences = lifeList.experiences.filter(
          (exp) => exp._id !== lifeListExperienceId
        );

        const updatedLifeList = {
          ...lifeList,
          experiences: updatedExperiences,
        };

        setLifeList(updatedLifeList);

        // Cache updated LifeList
        await cacheLifeList(updatedLifeList);

        // Remove cached image
        const cacheKey = `${CACHE_KEY_LIFELIST_IMAGE_PREFIX}${lifeListExperienceId}`;
        await deleteImageFromFileSystem(cacheKey);
      }
    } catch (error) {
      console.error(
        "[AdminLifeListContext] Error removing experience from LifeList:",
        error
      );
    }
  };

  const resetLifeListState = () => {
    setLifeList(null);
    setIsLifeListCacheInitialized(false);
  };

  const contextValue = {
    lifeList,
    isLifeListCacheInitialized,
    initializeLifeListCache,
    addLifeListExperienceToCache,
    updateLifeListExperienceInCache,
    removeLifeListExperienceFromCache,
    resetLifeListState,
  };

  return (
    <AdminLifeListContext.Provider value={contextValue}>
      {children}
    </AdminLifeListContext.Provider>
  );
};

export const useAdminLifeList = () => useContext(AdminLifeListContext);
