import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Messages from "../Screens/TabScreens/Messages";
import Notifications from "../Screens/TabScreens/Notifications";

const Tab = createMaterialTopTabNavigator();

export default function InboxNavigator() {
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
        },
      }}
    >
      <Tab.Screen name="Messages" component={Messages} />
      <Tab.Screen name="Notifications" component={Notifications} />
    </Tab.Navigator>
  );
}
