import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Experiences from "../Screens/Experiences";
import Entries from "../Screens/Entries";

const Tab = createMaterialTopTabNavigator();

export default function SummaryNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Messages"
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
          marginBottom: 10,
        },
      }}
    >
      <Tab.Screen name="Entries" component={Entries} />
      <Tab.Screen name="Experiences" component={Experiences} />
    </Tab.Navigator>
  );
}
