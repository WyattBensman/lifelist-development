import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Authentication from "../pages/Authentication/Screens/Authentication";
import SetLoginInformation from "../pages/Authentication/Screens/SetLoginInformation";
import SetProfileInformation from "../pages/Authentication/Screens/SetProfileInformation";

const Stack = createNativeStackNavigator();

export default function AuthenticationStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Authentication"
        component={Authentication}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SetLoginInformation"
        component={SetLoginInformation}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SetProfileInformation"
        component={SetProfileInformation}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
