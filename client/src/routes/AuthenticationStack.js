import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CreateAccountScreen from "../pages/Authentication/Screens/CreateAccountScreen";
import LoginScreen from "../pages/Authentication/Screens/LoginScreen";
import SetLoginInformationScreen from "../pages/Authentication/Screens/SetLoginInformationScreen";
import SetProfileInformationScreen from "../pages/Authentication/Screens/SetProfileInformationScreen";
import SetPermissionsScreen from "../pages/Authentication/Screens/SetPermissionsScreen";
import ShareEarlyAccessScreen from "../pages/Authentication/Screens/ShareEarlyAccessScreen";
import EarlyAccessScreen from "../pages/Authentication/Screens/EarlyAccessScreen";
import SetProfilePictureScreen from "../pages/Authentication/Screens/SetProfilePictureScreen";

const Stack = createNativeStackNavigator();

export default function AuthenticationStack({
  initialRouteName = "CreateAccount",
}) {
  return (
    <Stack.Navigator initialRouteName={initialRouteName}>
      <Stack.Screen
        name="EarlyAccess"
        component={EarlyAccessScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CreateAccount"
        component={CreateAccountScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SetLoginInformation"
        component={SetLoginInformationScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SetProfileInformation"
        component={SetProfileInformationScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SetProfilePicture"
        component={SetProfilePictureScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SetPermissions"
        component={SetPermissionsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ShareEarlyAccess"
        component={ShareEarlyAccessScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
