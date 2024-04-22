import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import DispoCameraRoll from "../Screens/35mmCameraRoll";
import CameraRoll from "../Screens/CameraRoll";

const Tab = createMaterialTopTabNavigator();

export default function MediaNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Messages"
      screenOptions={{
        tabBarActiveTintColor: "#000000",
        tabBarInactiveTintColor: "#d4d4d4",
        tabBarStyle: {
          backgroundColor: "#ffffff",
          height: 42.5,
        },
        tabBarIndicatorStyle: {
          backgroundColor: "#6AB952",
        },
        tabBarLabelStyle: {
          textTransform: "none",
          fontSize: 14,
          marginBottom: 10,
        },
      }}
    >
      <Tab.Screen name="Camera Roll" component={CameraRoll} />
      <Tab.Screen name="Your Shots" component={DispoCameraRoll} />
    </Tab.Navigator>
  );
}
