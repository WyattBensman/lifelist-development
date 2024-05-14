import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { useTheme } from "react-native-paper";
import { useNavigationContext } from "../contexts/NavigationContext";

import MainFeedStack from "./MainFeedStack";
import CameraHome from "../pages/Camera/Screens/CameraHome";
import ExploreStack from "./ExploreStack";
import LifeListStack from "./LifeListStack";
import ProfileStack from "./ProfileStack";
import TabIcon from "../icons/NavigationBar/TabIcon";

const Tab = createMaterialBottomTabNavigator();

export default function NavigationTab() {
  const theme = useTheme();
  theme.colors.secondaryContainer = "";
  const { isTabBarVisible } = useNavigationContext();

  return (
    <Tab.Navigator
      barStyle={{
        backgroundColor: "#262828",
        height: isTabBarVisible ? 75 : 0,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        overflow: "hidden",
        display: isTabBarVisible ? "flex" : "none",
      }}
    >
      <Tab.Screen
        name="MainFeed"
        component={MainFeedStack}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabIcon focused={focused} color={color} routeName="Home" />
          ),
          tabBarLabel: () => null,
        }}
      />
      <Tab.Screen
        name="Explore"
        component={ExploreStack}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabIcon focused={focused} color={color} routeName="Explore" />
          ),
          tabBarLabel: () => null,
        }}
      />
      <Tab.Screen
        name="Camera"
        component={CameraHome}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabIcon focused={focused} color={color} routeName="Camera" />
          ),
          tabBarLabel: () => null,
        }}
      />
      <Tab.Screen
        name="LifeList"
        component={LifeListStack}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabIcon focused={focused} color={color} routeName="LifeList" />
          ),
          tabBarLabel: () => null,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabIcon focused={focused} color={color} routeName="Profile" />
          ),
          tabBarLabel: () => null,
        }}
      />
    </Tab.Navigator>
  );
}
