import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Text } from "react-native";
import Media from "../Screens/Media";
import Summary from "../Screens/Summary";

const Tab = createMaterialTopTabNavigator();

export default function CollageNavigator({ onTabChange }) {
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
          fontWeight: "500",
        },
      }}
    >
      <Tab.Screen
        name="Media"
        component={Media}
        options={{
          tabBarLabel: () => <Text style={{ marginBottom: 2 }}>Media</Text>,
        }}
      />
      <Tab.Screen
        name="Summary"
        component={Summary}
        options={{
          tabBarLabel: () => <Text style={{ marginBottom: 2 }}>Summary</Text>,
        }}
      />
    </Tab.Navigator>
  );
}
