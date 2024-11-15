import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native"; // Import NavigationContainer
import AsyncStorage from "@react-native-async-storage/async-storage";
import NavigationTab from "./src/routes/NavigationTab";
import AuthenticationStack from "./src/routes/AuthenticationStack";
import { useAuth } from "./src/contexts/AuthContext";
import LoadingScreen from "./src/pages/Loading/LoadingScreen";

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
    content = <NavigationTab />;
  }

  return <NavigationContainer>{content}</NavigationContainer>;
}

/*   useEffect(() => {
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
      return <AuthenticationStack initialRouteName={"EarlyAccess"} />;
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
    </NavigationContainer>
  );
}
 */
