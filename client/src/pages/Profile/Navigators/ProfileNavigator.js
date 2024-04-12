import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Collages from "../Screens/Collages";
import Reposts from "../Screens/Reposts";
import WorldMap from "../Screens/WorldMap";
import CollagesIcon from "../Icons/CollagesIcon";
import MapIcon from "../Icons/MapIcon";
import LifeListIcon from "../Icons/LifeListIcon";
import RepostsIcon from "../Icons/RepostsIcon";
import { useNavigation } from "@react-navigation/native";

const Tab = createMaterialTopTabNavigator();

export default function ProfileNavigator({ onTabChange }) {
  const navigation = useNavigation();

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
          backgroundColor: "#6AB952", // Indicator color
        },
        tabBarLabelStyle: {
          textTransform: "none",
          fontSize: 15,
          marginBottom: 10, // Adjust text position
        },
        scrollEnabled: true, // Enable scrolling for more tabs
      }}
    >
      <Tab.Screen
        name="Collages"
        component={Collages}
        options={{
          tabBarLabel: ({ focused }) => (
            <CollagesIcon color={focused ? "#000000" : "#d4d4d4"} />
          ),
        }}
        listeners={{
          focus: () => onTabChange && onTabChange("Collages"),
        }}
      />
      <Tab.Screen
        name="Reposts"
        component={Reposts}
        options={{
          tabBarLabel: ({ focused }) => (
            <RepostsIcon color={focused ? "#000000" : "#d4d4d4"} />
          ),
        }}
        listeners={{
          focus: () => onTabChange && onTabChange("Reposts"),
        }}
      />
      <Tab.Screen
        name="LifeList"
        component={Collages}
        options={{
          tabBarLabel: ({ focused }) => (
            <LifeListIcon color={focused ? "#000000" : "#d4d4d4"} />
          ),
        }}
        listeners={{
          focus: () => onTabChange && onTabChange("LifeList"),
          tabPress: (e) => {
            e.preventDefault(); // Prevent default tab press behavior
            navigation.navigate("ViewLifeList"); // Navigate using stack
          },
        }}
      />
      <Tab.Screen
        name="WorldMap"
        component={WorldMap}
        options={{
          tabBarLabel: ({ focused }) => (
            <MapIcon color={focused ? "#000000" : "#d4d4d4"} />
          ),
        }}
        listeners={{
          focus: () => onTabChange && onTabChange("WorldMap"),
          tabPress: (e) => {
            e.preventDefault(); // Prevent default tab press behavior
            navigation.navigate("WorldMap"); // Navigate using stack
          },
        }}
      />
    </Tab.Navigator>
  );
}
