import React, { createContext, useState, useContext } from "react";
import { useCameraPermissions } from "expo-camera"; // Camera permissions
import * as Contacts from "expo-contacts"; // Contacts permissions
import * as Notifications from "expo-notifications"; // Notifications permissions

// Create the PermissionsContext
const PermissionsContext = createContext();

// PermissionsProvider Component
export const PermissionsProvider = ({ children }) => {
  const [cameraAccessGranted, setCameraAccessGranted] = useState(false);
  const [contactsAccessGranted, setContactsAccessGranted] = useState(false);
  const [notificationsAccessGranted, setNotificationsAccessGranted] =
    useState(false);

  // Request camera permission
  const requestCameraPermission = async () => {
    const { status } = await useCameraPermissions();
    const granted = status === "granted";
    setCameraAccessGranted(granted);
    return granted;
  };

  // Request contacts permission
  const requestContactsPermission = async () => {
    const { status } = await Contacts.requestPermissionsAsync();
    const granted = status === "granted";
    setContactsAccessGranted(granted);
    return granted;
  };

  // Request notifications permission
  const requestNotificationPermission = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    const granted = status === "granted";
    setNotificationsAccessGranted(granted);
    return granted;
  };

  return (
    <PermissionsContext.Provider
      value={{
        cameraAccessGranted,
        contactsAccessGranted,
        notificationsAccessGranted,
        requestCameraPermission,
        requestContactsPermission,
        requestNotificationPermission,
      }}
    >
      {children}
    </PermissionsContext.Provider>
  );
};

// Custom hook to use the PermissionsContext
export const usePermissions = () => useContext(PermissionsContext);
