import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Followers from "../Screens/TabScreens/Followers";
import Following from "../Screens/TabScreens/Following";

const Tab = createMaterialTopTabNavigator();

export default function UserRelationsNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Followers"
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
          fontSize: 14,
          textTransform: "capitalize",
        },
      }}
    >
      <Tab.Screen name="Followers" component={Followers} />
      <Tab.Screen name="Following" component={Following} />
    </Tab.Navigator>
  );
}
