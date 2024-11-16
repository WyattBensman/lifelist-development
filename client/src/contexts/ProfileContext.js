import React, { createContext, useContext, useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { UPDATE_USER_DATA } from "../utils/mutations";
import { GET_USER_DATA } from "../utils/queries";

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [originalProfile, setOriginalProfile] = useState(null); // Store the original fetched data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  const { data } = useQuery(GET_USER_DATA, {
    onCompleted: (data) => {
      console.log("GET_USER_DATA query executed:", data); // Log when query is completed
      setProfile(data.getUserData);
      setOriginalProfile(data.getUserData); // Save the initial state
      setLoading(false);
    },
    onError: (error) => {
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
      setProfile(result.data.updateUserData.user);
      setOriginalProfile(result.data.updateUserData.user); // Update originalProfile
      setUnsavedChanges(false);
    } catch (error) {
      console.error("Failed to save profile:", error);
    }
  };

  const resetChanges = () => {
    setProfile(originalProfile); // Reset to the initial fetched state
    setUnsavedChanges(false);
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
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);
