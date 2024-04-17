import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import All from "../Screens/TabScreens/All";
import Activities from "../Screens/TabScreens/Activities";

const Tab = createMaterialTopTabNavigator();

export default function CategoryNavigator() {
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
          width: "auto",
        },
        tabBarScrollEnabled: true,
      }}
    >
      <Tab.Screen name="All" component={All} />
      <Tab.Screen name="Activities" component={Activities} />
      <Tab.Screen name="Attractions" component={All} />
      <Tab.Screen name="Destinations" component={Activities} />
      <Tab.Screen name="Events" component={All} />
      <Tab.Screen name="Festivals" component={Activities} />
    </Tab.Navigator>
  );
}
