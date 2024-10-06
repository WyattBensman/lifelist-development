import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NavigationTab from "./src/routes/NavigationTab";
import AuthenticationStack from "./src/routes/AuthenticationStack";
import EarlyAccessScreen from "./src/pages/Authentication/Screens/EarlyAccessScreen";
import { View, Text } from "react-native";
import { useAuth } from "./src/contexts/AuthContext";
import CustomAlert from "./src/components/Alerts/CustomAlert";

export default function AppNavigator() {
  const [isEarlyAccessUnlocked, setIsEarlyAccessUnlocked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [registrationProgress, setRegistrationProgress] =
    useState("CreateAccount"); // Default step is CreateAccount
  const [showResumeModal, setShowResumeModal] = useState(false); // State to show the resume modal
  const { isAuthenticated, registrationComplete } = useAuth();

  useEffect(() => {
    const checkAccessStatus = async () => {
      try {
        const isUnlocked = await AsyncStorage.getItem("isEarlyAccessUnlocked");
        const savedProgress = await AsyncStorage.getItem(
          "registrationProgress"
        );

        setIsEarlyAccessUnlocked(isUnlocked === "true");

        // Check if the saved progress is at or beyond "SetPermissions"
        if (
          savedProgress === "SetPermissions" ||
          savedProgress === "ShareEarlyAccess"
        ) {
          setRegistrationProgress(savedProgress);
          setShowResumeModal(true); // Show the resume modal if they haven't completed onboarding
        } else {
          // If saved progress is before "SetPermissions", clear local storage
          await clearIncompleteOnboardingData();
        }

        setIsLoading(false); // Set loading to false after checking
      } catch (error) {
        console.error("Error loading initial app state:", error);
        setIsLoading(false);
      }
    };

    checkAccessStatus();
  }, []);

  // Function to clear incomplete onboarding data
  const clearIncompleteOnboardingData = async () => {
    try {
      await AsyncStorage.removeItem("signupData");
      await AsyncStorage.removeItem("registrationProgress");
      console.log("Incomplete onboarding data cleared from AsyncStorage.");
    } catch (error) {
      console.error("Error clearing incomplete onboarding data: ", error);
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const handleResumeOnboarding = () => {
    setShowResumeModal(false); // Close the alert and resume onboarding
  };

  const handleStartFresh = async () => {
    console.log("started refresh");

    await clearIncompleteOnboardingData(); // Clear any stored onboarding data
    setRegistrationProgress("CreateAccount"); // Reset to initial step
    setShowResumeModal(false); // Close the alert
  };

  const renderNavigator = () => {
    // Show Early Access Screen if not unlocked
    if (!isEarlyAccessUnlocked) {
      return <EarlyAccessScreen />;
    }

    // If user is not authenticated, navigate to the correct step in the AuthenticationStack
    if (!isAuthenticated) {
      return <AuthenticationStack initialRouteName={registrationProgress} />;
    }

    // If registration is complete, show main application
    if (registrationComplete) {
      return <NavigationTab />;
    }

    // Otherwise, navigate based on registrationProgress starting from "SetPermissions" onward
    return <AuthenticationStack initialRouteName={registrationProgress} />;
  };

  return (
    <NavigationContainer>
      {renderNavigator()}

      {/* CustomAlert to prompt user to resume onboarding */}
      <CustomAlert
        visible={showResumeModal}
        onRequestClose={() => setShowResumeModal(false)}
        title="Resume Your Onboarding?"
        message="It looks like you didn't complete your onboarding process. Would you like to continue where you left off?"
        onConfirm={handleResumeOnboarding}
        onCancel={handleStartFresh}
        confirmButtonText="Continue"
        cancelButtonText="Start Over"
      />
    </NavigationContainer>
  );
}
