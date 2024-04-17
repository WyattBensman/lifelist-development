import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Text } from "react-native";
import Experiences from "../Screens/Experiences";
import Entries from "../Screens/Entries";

const Tab = createMaterialTopTabNavigator();

export default function SummaryNavigator() {
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
        name="Entries"
        component={Entries}
        options={{
          tabBarLabel: () => <Text style={{ marginBottom: 2 }}>Entries</Text>,
        }}
      />
      <Tab.Screen
        name="Experiences"
        component={Experiences}
        options={{
          tabBarLabel: () => (
            <Text style={{ marginBottom: 2 }}>Experiences</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
}
