import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { useTheme } from "react-native-paper";
import { useNavigationContext } from "../contexts/NavigationContext";
import MainFeedStack from "./MainFeedStack";
import ExploreStack from "./ExploreStack";
import TabIcon from "../icons/NavigationBar/TabIcon";
import CameraStack from "./CameraStack";
import AdminProfileStack from "./AdminProfileStack";
import AdminLifeListStack from "./AdminLifeListStack";
import { useNavigationState } from "@react-navigation/native";
import { useEffect } from "react";

const Tab = createMaterialBottomTabNavigator();

export default function NavigationTab() {
  const theme = useTheme();
  theme.colors.secondaryContainer = "";

  const state = useNavigationState((state) => state);
  const { isTabBarVisible, setIsTabBarVisible } = useNavigationContext();

  // Define routes where the TabBar should be hidden
  const hiddenTabBarRoutes = [
    "Camera",
    "CreateCollage",
    "EditProfile",
    "Saved",
    "Archived",
    "ViewShot",
    "ViewExperience",
  ];

  useEffect(() => {
    if (state?.routes) {
      const currentRouteName = state.routes[state.index]?.name;
      // Check if the current route is in the hiddenTabBarRoutes array
      if (hiddenTabBarRoutes.includes(currentRouteName)) {
        setIsTabBarVisible(false);
      } else {
        setIsTabBarVisible(true);
      }
    }
  }, [state, setIsTabBarVisible]);

  return (
    <Tab.Navigator
      barStyle={{
        backgroundColor: "#252525",
        flex: isTabBarVisible ? 0.095 : 0,
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
        component={CameraStack}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabIcon focused={focused} color={color} routeName="Camera" />
          ),
          tabBarLabel: () => null,
        }}
      />
      <Tab.Screen
        name="AdminLifeListStack"
        component={AdminLifeListStack}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabIcon focused={focused} color={color} routeName="LifeList" />
          ),
          tabBarLabel: () => null,
        }}
      />
      <Tab.Screen
        name="AdminProfileStack"
        component={AdminProfileStack}
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
