import { NavigationContainer } from "@react-navigation/native";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import MainFeed from "../pages/MainFeed/Screens/MainFeed";
import ExploreHome from "../pages/Explore/Screens/ExploreHome";
import CameraHome from "../pages/Camera/Screens/CameraHome";
import LifeList from "../pages/LifeList/Screens/LifeList";
import Profile from "../pages/Profile/Screens/Profile";

const Tab = createMaterialBottomTabNavigator();

export default function NavigationTab() {
  return (
    <NavigationContainer>
      <Tab.Navigator barStyle={{ backgroundColor: "#262828" }} shifting={true}>
        <Tab.Screen name="MainFeed" component={MainFeed} />
        <Tab.Screen
          name="Explore"
          component={ExploreHome}
          options={{ tabBarLabel: () => null }}
        />
        <Tab.Screen name="Camera" component={CameraHome} />
        <Tab.Screen name="LifeList" component={LifeList} />
        <Tab.Screen
          name="Profile"
          component={Profile}
          options={{ tabBarLabel: () => null }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
