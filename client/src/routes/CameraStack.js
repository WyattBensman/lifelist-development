import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CameraHome from "../pages/Camera/Screens/CameraHome";
import CameraRoll from "../pages/Camera/Screens/CameraRoll";
import DevelopingRoll from "../pages/Camera/Screens/DevelopingRoll";

const Stack = createNativeStackNavigator();

export default function CameraStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#000000",
        },
        cardStyle: { backgroundColor: "#ffffff" },
      }}
    >
      <Stack.Screen
        name="Home"
        component={CameraHome}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CameraRoll"
        component={CameraRoll}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DevelopingRoll"
        component={DevelopingRoll}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
