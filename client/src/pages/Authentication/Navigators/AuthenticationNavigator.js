import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Text } from "react-native";
import SignUp from "../Screens/SignUp";
import Login from "../Screens/Login";

const Tab = createMaterialTopTabNavigator();

export default function AuthenticationNavigator({ onTabChange }) {
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
        name="SignUp"
        component={SignUp}
        options={{
          tabBarLabel: () => <Text style={{ marginBottom: 2 }}>Sign Up</Text>,
        }}
        listeners={{
          focus: () => onTabChange("Sign Up"),
        }}
      />
      <Tab.Screen
        name="Login"
        component={Login}
        options={{
          tabBarLabel: () => <Text style={{ marginBottom: 2 }}>Login</Text>,
        }}
        listeners={{
          focus: () => onTabChange("Login"),
        }}
      />
    </Tab.Navigator>
  );
}
