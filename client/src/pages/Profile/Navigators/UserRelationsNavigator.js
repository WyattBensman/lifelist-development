import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Followers from "../Screens/TabScreens/Followers";
import Following from "../Screens/TabScreens/Following";
import { Text } from "react-native";

const Tab = createMaterialTopTabNavigator();

export default function UserRelationsNavigator() {
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
          fontSize: 14,
        },
      }}
    >
      <Tab.Screen
        name="Followers"
        component={Followers}
        options={{
          tabBarLabel: "Followers",
        }}
      />
      <Tab.Screen
        name="Following"
        component={Following}
        options={{
          tabBarLabel: "Following",
        }}
      />
    </Tab.Navigator>
  );
}
