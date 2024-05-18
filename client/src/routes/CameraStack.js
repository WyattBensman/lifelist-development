import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CameraHome from "../pages/Camera/Screens/CameraHome";
import CameraRoll from "../pages/Camera/Screens/CameraRoll";
import DevelopingRoll from "../pages/Camera/Screens/DevelopingRoll";
import CreateAlbum from "../pages/Camera/Screens/CreateAlbum";
import ViewShot from "../pages/Camera/Screens/ViewShot";
import ViewAlbum from "../pages/Camera/Screens/ViewAlbum";

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
      <Stack.Screen
        name="CreateAlbum"
        component={CreateAlbum}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ViewShot"
        component={ViewShot}
        options={{ headerShown: false, animation: "none" }}
      />
      <Stack.Screen
        name="ViewAlbum"
        component={ViewAlbum}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
