import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Text } from "react-native";
import DispoCameraRoll from "../Screens/35mmCameraRoll";
import CameraRoll from "../Screens/CameraRoll";

const Tab = createMaterialTopTabNavigator();

export default function MediaNavigator() {
  return (
    <Tab.Navigator
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
          fontSize: 15,
          marginBottom: 10,
        },
      }}
    >
      <Tab.Screen
        name="CameraRoll"
        component={CameraRoll}
        options={{
          tabBarLabel: () => (
            <Text style={{ marginBottom: 2 }}>Camera Roll</Text>
          ),
        }}
      />
      <Tab.Screen
        name="35mmCamera"
        component={DispoCameraRoll}
        options={{
          tabBarLabel: () => (
            <Text style={{ marginBottom: 2 }}>35mm Camera</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
}
