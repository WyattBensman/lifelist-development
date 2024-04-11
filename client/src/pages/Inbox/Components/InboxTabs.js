import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Messages from "../Screens/Messages";
import Notifications from "../Screens/Notifications";
import { Text } from "react-native";

const Tab = createMaterialTopTabNavigator();

export default function InboxTabs({ onTabChange }) {
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
        name="Messages"
        component={Messages}
        options={{
          tabBarLabel: () => <Text style={{ marginBottom: 2 }}>Messages</Text>,
        }}
        listeners={{
          focus: () => onTabChange("Messages"),
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={Notifications}
        options={{
          tabBarLabel: () => (
            <Text style={{ marginBottom: 2 }}>Notifications</Text>
          ),
        }}
        listeners={{
          focus: () => onTabChange("Notifications"),
        }}
      />
    </Tab.Navigator>
  );
}
