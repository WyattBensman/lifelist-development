import React, { createContext, useContext, useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { UPDATE_USER_DATA } from "../utils/mutations";
import { GET_USER_DATA } from "../utils/queries";
import {
  saveImageToFileSystem,
  getImageFromFileSystem,
  saveToAsyncStorage,
  getFromAsyncStorage,
} from "../utils/cacheHelper";
import { useAuth } from "./AuthContext";

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [originalProfile, setOriginalProfile] = useState(null); // Store the original fetched data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [shouldRefetch, setShouldRefetch] = useState(false);

  const CACHE_KEY = `profile_data_${currentUser}`;
  const PROFILE_PICTURE_KEY = `profile_picture_${currentUser}`;

  useEffect(() => {
    const initializeProfile = async () => {
      const cachedData = await getFromAsyncStorage(CACHE_KEY);
      const cachedProfilePicture = await getImageFromFileSystem(
        PROFILE_PICTURE_KEY
      );

      console.log("Cached Data:", cachedData); // Log the metadata
      console.log("Cached Profile Picture URI:", cachedProfilePicture); // Log the profile picture URI

      if (cachedData) {
        const profileWithImage = {
          ...cachedData,
          profilePicture: cachedProfilePicture || cachedData.profilePicture,
        };
        setProfile(profileWithImage);
        setOriginalProfile(profileWithImage);
        setLoading(false);
      } else {
        setShouldRefetch(true);
      }
    };

    initializeProfile();
  }, []);

  const { data } = useQuery(GET_USER_DATA, {
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

      setProfile(profileWithImage);
      setOriginalProfile(profileWithImage);

      await saveToAsyncStorage(CACHE_KEY, userData); // Save metadata
      setLoading(false);
      setShouldRefetch(false);
    },
    onError: (error) => {
      console.error("GET_USER_DATA query error:", error);
      setError(error);
      setLoading(false);
    },
  });

  const [updateUserDataMutation] = useMutation(UPDATE_USER_DATA);

  const updateProfileField = (key, value) => {
    setProfile((prev) => ({ ...prev, [key]: value }));
    setUnsavedChanges(true);
  };

  const saveProfile = async () => {
    try {
      const result = await updateUserDataMutation({
        variables: { ...profile },
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

      setProfile(profileWithImage);
      setOriginalProfile(profileWithImage);

      await saveToAsyncStorage(CACHE_KEY, updatedUserData);
      setUnsavedChanges(false);
    } catch (error) {
      console.error("Failed to save profile:", error);
    }
  };

  const resetChanges = () => {
    setProfile(originalProfile);
    setUnsavedChanges(false);
  };

  const refreshProfile = async () => {
    setShouldRefetch(true);
    setLoading(true);
  };

  return (
    <ProfileContext.Provider
      value={{
        profile,
        loading,
        error,
        unsavedChanges,
        updateProfileField,
        saveProfile,
        resetChanges,
        refreshProfile,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);
