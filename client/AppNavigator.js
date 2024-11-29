import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NavigationTab from "./src/routes/NavigationTab";
import AuthenticationStack from "./src/routes/AuthenticationStack";
import { useAuth } from "./src/contexts/AuthContext";
import LoadingScreen from "./src/pages/Loading/LoadingScreen";
import { ProfileProvider } from "./src/contexts/ProfileContext";
import { DevelopingRollProvider } from "./src/contexts/DevelopingRollContext";
import { CameraAlbumProvider } from "./src/contexts/CameraAlbumContext";
import { CameraRollProvider } from "./src/contexts/CameraRollContext";

export default function AppNavigator() {
  const [isEarlyAccessUnlocked, setIsEarlyAccessUnlocked] = useState(null);
  const [isChecking, setIsChecking] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const checkEarlyAccess = async () => {
      try {
        const value = await AsyncStorage.getItem("isEarlyAccessUnlocked");
        console.log(value);

        setIsEarlyAccessUnlocked(value === "true");
      } catch (error) {
        console.error("Error checking AsyncStorage", error);
      } finally {
        setIsChecking(false);
      }
    };

    checkEarlyAccess();
  }, []);

  if (isChecking) return <LoadingScreen />;

  let content;
  if (!isEarlyAccessUnlocked) {
    content = <AuthenticationStack initialRouteName="EarlyAccess" />;
  } else if (!isAuthenticated) {
    content = <AuthenticationStack initialRouteName="CreateAccount" />;
  } else {
    // Wrap NavigationTab with ProfileProvider
    content = (
      <ProfileProvider>
        <CameraAlbumProvider>
          <CameraRollProvider>
            <DevelopingRollProvider>
              <NavigationTab />
            </DevelopingRollProvider>
          </CameraRollProvider>
        </CameraAlbumProvider>
      </ProfileProvider>
    );
  }

  return <NavigationContainer>{content}</NavigationContainer>;
}
