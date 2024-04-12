import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Trending from "../Screens/TabScreens/Trending";
import Recent from "../Screens/TabScreens/Recent";
import { Text } from "react-native";

const Tab = createMaterialTopTabNavigator();

export default function ExploreTabs({ onTabChange }) {
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
        name="Trending"
        component={Trending}
        options={{
          tabBarLabel: () => <Text style={{ marginBottom: 2 }}>Trending</Text>,
        }}
        listeners={{
          focus: () => onTabChange("Trending"),
        }}
      />
      <Tab.Screen
        name="Recent"
        component={Recent}
        options={{
          tabBarLabel: () => <Text style={{ marginBottom: 2 }}>Recent</Text>,
        }}
        listeners={{
          focus: () => onTabChange("Recent"),
        }}
      />
    </Tab.Navigator>
  );
}
