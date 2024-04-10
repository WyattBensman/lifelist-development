import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Trending from "../Screens/Trending";
import Recent from "../Screens/Recent";

const Tab = createMaterialTopTabNavigator();

export default function ExploreTabs({ onTabChange }) {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "#000000",
        tabBarInactiveTintColor: "#d4d4d4",
        tabBarStyle: {
          backgroundColor: "#ffffff",
        },
        tabBarIndicatorStyle: {
          backgroundColor: "#6AB952",
        },
        tabBarLabelStyle: {
          textTransform: "none",
          fontSize: 15,
        },
      }}
    >
      <Tab.Screen
        name="Trending"
        component={Trending}
        listeners={{
          focus: () => onTabChange("Trending"),
        }}
      />
      <Tab.Screen
        name="Recent"
        component={Recent}
        listeners={{
          focus: () => onTabChange("Recent"),
        }}
      />
    </Tab.Navigator>
  );
}
