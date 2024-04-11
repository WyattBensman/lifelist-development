import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Followers from "../Screens/Followers";
import Following from "../Screens/Following";
import { Text } from "react-native";

const Tab = createMaterialTopTabNavigator();

const UserRelationsNavigator = () => {
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
        name="Followers"
        component={Followers}
        options={{
          tabBarLabel: () => <Text style={{ marginBottom: 2 }}>Followers</Text>,
        }}
      />
      <Tab.Screen
        name="Following"
        component={Following}
        options={{
          tabBarLabel: () => <Text style={{ marginBottom: 2 }}>Following</Text>,
        }}
      />
    </Tab.Navigator>
  );
};

export default UserRelationsNavigator;
