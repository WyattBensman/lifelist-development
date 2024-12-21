import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
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
          height: 40,
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
      <Tab.Screen name="Media" component={Media} />
      <Tab.Screen name="Summary" component={Summary} />
    </Tab.Navigator>
  );
}
