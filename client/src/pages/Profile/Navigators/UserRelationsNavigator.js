import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Followers from "../Screens/TabScreens/Followers";
import Following from "../Screens/TabScreens/Following";

const Tab = createMaterialTopTabNavigator();

export default function UserRelationsNavigator({ userId }) {
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
      <Tab.Screen name="Followers">
        {() => <Followers userId={userId} />}
      </Tab.Screen>
      <Tab.Screen name="Following">
        {() => <Following userId={userId} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
