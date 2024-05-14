import NavigationTab from "./src/routes/NavigationTab";
import AuthenticationStack from "./src/routes/AuthenticationStack";
import { NavigationContainer } from "@react-navigation/native";
import SetLoginInformation from "./src/pages/Authentication/Screens/SetLoginInformation";
import SetProfileInformation from "./src/pages/Authentication/Screens/SetProfileInformation";
import { useAuth } from "./src/contexts/AuthContext";

export default function AppNavigator() {
  const { isAuthenticated, registrationProgress, registrationComplete } =
    useAuth();

  const renderNavigator = () => {
    if (!isAuthenticated) {
      return <AuthenticationStack />;
    }

    if (registrationComplete) {
      return <NavigationTab />;
    }

    switch (registrationProgress) {
      case "login":
        return <SetLoginInformation />;
      case "profile":
        return <SetProfileInformation />;
      default:
        return <NavigationTab />;
    }
  };

  return <NavigationContainer>{renderNavigator()}</NavigationContainer>;
}
