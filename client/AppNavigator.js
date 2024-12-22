import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NavigationTab from "./src/routes/NavigationTab";
import AuthenticationStack from "./src/routes/AuthenticationStack";
import { useAuth } from "./src/contexts/AuthContext";
import LoadingScreen from "./src/pages/Loading/LoadingScreen";
import { DevelopingRollProvider } from "./src/contexts/DevelopingRollContext";
import { CameraAlbumProvider } from "./src/contexts/CameraAlbumContext";
import { CameraRollProvider } from "./src/contexts/CameraRollContext";
import { LifeListProvider } from "./src/contexts/LifeListContext";
import { AdminProfileProvider } from "./src/contexts/AdminProfileContext";

export default function AppNavigator() {
  const [isEarlyAccessUnlocked, setIsEarlyAccessUnlocked] = useState(null);
  const [isChecking, setIsChecking] = useState(true);
  const { isAuthenticated } = useAuth();

  // Check the Early Access status on app load
  useEffect(() => {
    const checkEarlyAccess = async () => {
      try {
        const value = await AsyncStorage.getItem("isEarlyAccessUnlocked");
        setIsEarlyAccessUnlocked(value === "true");
      } catch (error) {
        console.error("Error checking Early Access flag", error);
      } finally {
        setIsChecking(false);
      }
    };

    checkEarlyAccess();
  }, []);

  if (isChecking) return <LoadingScreen />;

  return (
    <NavigationContainer>
      {isEarlyAccessUnlocked === false ? (
        <AuthenticationStack initialRouteName="EarlyAccess" />
      ) : !isAuthenticated ? (
        <AuthenticationStack initialRouteName="Login" />
      ) : (
        <AdminProfileProvider>
            <LifeListProvider>
              <CameraAlbumProvider>
                <CameraRollProvider>
                  <DevelopingRollProvider>
                    <NavigationTab />
                  </DevelopingRollProvider>
                </CameraRollProvider>
              </CameraAlbumProvider>
            </LifeListProvider>
        </AdminProfileProvider>
      )}
    </NavigationContainer>
  );
}
