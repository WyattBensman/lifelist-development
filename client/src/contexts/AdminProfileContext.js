import React, { createContext, useContext, useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { UPDATE_USER_DATA } from "../utils/mutations";
import { GET_USER_DATA } from "../utils/queries";
import {
  saveImageToFileSystem,
  getImageFromFileSystem,
  saveMetadataToCache,
  getMetadataFromCache,
} from "../utils/newCacheHelper";
import { useAuth } from "./AuthContext";

const AdminProfileContext = createContext();

export const AdminProfileProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [adminProfile, setAdminProfile] = useState(null);
  const [originalAdminProfile, setOriginalAdminProfile] = useState(null);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [shouldRefetch, setShouldRefetch] = useState(false);

  const CACHE_KEY = `admin_profile_data_${currentUser}`;
  const PROFILE_PICTURE_KEY = `admin_profile_picture_${currentUser}`;

  useEffect(() => {
    const initializeAdminProfile = async () => {
      const cachedData = await getMetadataFromCache(CACHE_KEY);
      const cachedProfilePicture = await getImageFromFileSystem(
        PROFILE_PICTURE_KEY
      );

      if (cachedData) {
        const profileWithImage = {
          ...cachedData,
          profilePicture: cachedProfilePicture || cachedData.profilePicture,
        };
        setAdminProfile(profileWithImage);
        setOriginalAdminProfile(profileWithImage);
      } else {
        setShouldRefetch(true);
      }
    };

    initializeAdminProfile();
  }, [CACHE_KEY]);

  const { data } = useQuery(GET_USER_DATA, {
    variables: { userId: currentUser },
    skip: !shouldRefetch,
    onCompleted: async (data) => {
      const userData = data.getUserData;

      const profilePictureUri = await saveImageToFileSystem(
        PROFILE_PICTURE_KEY,
        userData.profilePicture
      );

      const profileWithImage = {
        ...userData,
        profilePicture: profilePictureUri || userData.profilePicture,
      };

      setAdminProfile(profileWithImage);
      setOriginalAdminProfile(profileWithImage);

      await saveMetadataToCache(CACHE_KEY, userData); // Save metadata to the new cache
      setShouldRefetch(false);
    },
  });

  const [updateAdminDataMutation] = useMutation(UPDATE_USER_DATA);

  const updateAdminProfileField = (key, value) => {
    setAdminProfile((prev) => ({ ...prev, [key]: value }));
    setUnsavedChanges(true);
  };

  const saveAdminProfile = async () => {
    try {
      const result = await updateAdminDataMutation({
        variables: { ...adminProfile },
      });
      const updatedUserData = result.data.updateUserData.user;

      const profilePictureUri = await saveImageToFileSystem(
        PROFILE_PICTURE_KEY,
        updatedUserData.profilePicture
      );

      const profileWithImage = {
        ...updatedUserData,
        profilePicture: profilePictureUri || updatedUserData.profilePicture,
      };

      setAdminProfile(profileWithImage);
      setOriginalAdminProfile(profileWithImage);

      await saveMetadataToCache(CACHE_KEY, updatedUserData);
      setUnsavedChanges(false);
    } catch (error) {
      console.error("Failed to save admin profile:", error);
    }
  };

  const resetAdminChanges = () => {
    setAdminProfile(originalAdminProfile);
    setUnsavedChanges(false);
  };

  const refreshAdminProfile = async () => {
    setShouldRefetch(true);
  };

  return (
    <AdminProfileContext.Provider
      value={{
        adminProfile,
        unsavedChanges,
        updateAdminProfileField,
        saveAdminProfile,
        resetAdminChanges,
        refreshAdminProfile,
      }}
    >
      {children}
    </AdminProfileContext.Provider>
  );
};

export const useAdminProfile = () => useContext(AdminProfileContext);
