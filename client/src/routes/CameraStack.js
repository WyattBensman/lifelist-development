import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DevelopingRoll from "../pages/Camera/Screens/DevelopingRoll";
import CreateAlbum from "../pages/Camera/Screens/CreateAlbum";
import ViewShot from "../pages/Camera/Screens/ViewShot";
import ViewAlbum from "../pages/Camera/Screens/ViewAlbum";
import AddShotToExperience from "../pages/Camera/Screens/AddShotToExperience";
import AddShotToAlbum from "../pages/Camera/Screens/AddShotToAlbum";
import ManageAlbumShots from "../pages/Camera/Screens/ManageAlbumShots";
import RemoveShotsFromAlbum from "../pages/Camera/Screens/RemoveShotsFromAlbum.mjs";
import CameraRoll from "../pages/Camera/Screens/CameraRoll";
import CameraHome from "../pages/Camera/Screens/CameraHome";
import ViewDevelopingShot from "../pages/Camera/Cards/ViewDevelopingShot";

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
        options={{
          headerShown: false,
          animation: "slide_from_left",
        }}
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
        name="ViewDevelopingShot"
        component={ViewDevelopingShot}
        options={{ headerShown: false, animation: "none" }}
      />
      <Stack.Screen
        name="ViewAlbum"
        component={ViewAlbum}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddShotToExperience"
        component={AddShotToExperience}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddShotToAlbum"
        component={AddShotToAlbum}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ManageAlbumShots"
        component={ManageAlbumShots}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RemoveShotsFromAlbum"
        component={RemoveShotsFromAlbum}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
