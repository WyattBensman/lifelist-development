import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Authentication from "../pages/Authentication/Screens/Authentication";

const Stack = createNativeStackNavigator();

export default function AuthenticationStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Authentication"
        component={Authentication}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
