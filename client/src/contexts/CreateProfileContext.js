import React, { createContext, useState, useContext } from "react";
import { useCameraPermissions } from "expo-camera"; // Camera permissions
import * as Contacts from "expo-contacts"; // Contacts permissions

const CreateProfileContext = createContext();

export const CreateProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState({
    fullName: "",
    bio: "",
    gender: "",
    profilePicture: null,
    username: "",
    password: "",
    phoneNumber: "",
    email: "",
    birthday: "",
  });

  console.log(profile.profilePicture);

  const [cameraAccessGranted, setCameraAccessGranted] = useState(false);
  const [contactsAccessGranted, setContactsAccessGranted] = useState(false);

  // Camera Permissions: Hook for requesting and checking
  const [cameraPermissionStatus, requestCameraPermission] =
    useCameraPermissions();

  // Request camera access
  const handleCameraPermission = async () => {
    if (!cameraPermissionStatus?.granted) {
      const { status } = await requestCameraPermission();
      setCameraAccessGranted(status === "granted");
    } else {
      setCameraAccessGranted(true);
    }
  };

  // Request contacts access
  const handleContactsPermission = async () => {
    const { status } = await Contacts.requestPermissionsAsync();
    setContactsAccessGranted(status === "granted");
  };

  // Update profile fields
  const updateProfile = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  // Reset profile to initial state
  const resetProfile = () => {
    setProfile({
      fullName: "",
      bio: "",
      gender: "",
      profilePicture: null,
      username: "",
      password: "",
      phoneNumber: "",
      email: "",
      birthday: "",
    });
    setCameraAccessGranted(false);
    setContactsAccessGranted(false);
  };

  return (
    <CreateProfileContext.Provider
      value={{
        profile,
        updateProfile,
        resetProfile,
        cameraAccessGranted,
        contactsAccessGranted,
        handleCameraPermission,
        handleContactsPermission,
      }}
    >
      {children}
    </CreateProfileContext.Provider>
  );
};

// Custom hook to use the CreateProfileContext
export const useCreateProfileContext = () => useContext(CreateProfileContext);
