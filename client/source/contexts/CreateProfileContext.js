import React, { createContext, useState, useContext } from "react";

// Create the CreateProfileContext
const CreateProfileContext = createContext();

// CreateProfileProvider Component
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

  // Update profile fields
  const updateProfile = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  // Reset profile to its initial state
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
  };

  return (
    <CreateProfileContext.Provider
      value={{
        profile,
        updateProfile,
        resetProfile,
      }}
    >
      {children}
    </CreateProfileContext.Provider>
  );
};

// Custom hook to use the CreateProfileContext
export const useCreateProfileContext = () => useContext(CreateProfileContext);
