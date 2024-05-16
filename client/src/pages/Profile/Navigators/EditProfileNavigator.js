import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import EditContact from "../Screens/TabScreens/EditContact";
import EditSettings from "../Screens/TabScreens/EditSettings";
import EditProfile from "../Screens/TabScreens/EditProfile";

const Tab = createMaterialTopTabNavigator();

export default function EditProfileNavigator() {
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
        name="EditProfileTab"
        component={EditProfile}
        options={{
          tabBarLabel: "Profile",
        }}
      />
      <Tab.Screen
        name="EditContact"
        component={EditContact}
        options={{
          tabBarLabel: "Contact",
        }}
      />
      <Tab.Screen
        name="EditSettings"
        component={EditSettings}
        options={{
          tabBarLabel: "Settings",
        }}
      />
    </Tab.Navigator>
  );
}
