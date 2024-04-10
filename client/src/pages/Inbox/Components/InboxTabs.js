import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Messages from "../Screens/Messages";
import Notifications from "../Screens/Notifications";

const Tab = createMaterialTopTabNavigator();

function InboxTabs({ onTabChange }) {
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
        name="Messages"
        component={Messages}
        listeners={{
          focus: () => onTabChange("Messages"),
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={Notifications}
        listeners={{
          focus: () => onTabChange("Notifications"),
        }}
      />
    </Tab.Navigator>
  );
}

export default InboxTabs;
