import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useNavigationContext } from "../contexts/NavigationContext";
import MainFeedStack from "./MainFeedStack";
import ExploreStack from "./ExploreStack";
import CameraStack from "./CameraStack";
import AdminProfileStack from "./AdminProfileStack";
import AdminLifeListStack from "./AdminLifeListStack";
import { useNavigationState } from "@react-navigation/native";
import { useEffect } from "react";
import TabIcon from "../icons/NavigationBar/TabIcon";

const Tab = createBottomTabNavigator();

export default function NavigationTab() {
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
    "ListView",
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
      screenOptions={({ route }) => ({
        tabBarStyle: {
          backgroundColor: "#252525",
          overflow: "hidden",
          paddingTop: isTabBarVisible ? 18 : 0,
          paddingBottom: isTabBarVisible ? 34 : 0,
          height: isTabBarVisible ? 78 : 0,
          display: isTabBarVisible ? "flex" : "none",
        },
        headerShown: false, // Remove headers from stacks
      })}
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
