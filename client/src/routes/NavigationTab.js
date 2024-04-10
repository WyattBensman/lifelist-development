import { NavigationContainer } from "@react-navigation/native";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";

/* Screen */
import MainFeedStack from "./MainFeedStack";
import ExploreHome from "../pages/Explore/Screens/ExploreHome";
import CameraHome from "../pages/Camera/Screens/CameraHome";
import LifeList from "../pages/LifeList/Screens/LifeList";
import Profile from "../pages/Profile/Screens/Profile";
import TabIcon from "../icons/NavigationBar/TabIcon";
import { useTheme } from "react-native-paper";
import { useNavigationContext } from "../utils/NavigationContext";
import ExploreStack from "./ExploreStack";

const Tab = createMaterialBottomTabNavigator();

export default function NavigationTab() {
  const theme = useTheme();
  theme.colors.secondaryContainer = "";
  const { isTabBarVisible } = useNavigationContext();

  return (
    <NavigationContainer>
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
          component={LifeList}
          options={{
            tabBarIcon: ({ focused, color }) => (
              <TabIcon focused={focused} color={color} routeName="LifeList" />
            ),
            tabBarLabel: () => null,
          }}
        />
        <Tab.Screen
          name="Profile"
          component={Profile}
          options={{
            tabBarIcon: ({ focused, color }) => (
              <TabIcon focused={focused} color={color} routeName="Profile" />
            ),
            tabBarLabel: () => null,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
