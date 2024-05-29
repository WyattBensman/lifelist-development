import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useNavigation } from "@react-navigation/native";
import Collages from "../Screens/Collages";
import WorldMap from "../Screens/WorldMap";
import CollagesIcon from "../Icons/CollagesIcon";
import MapIcon from "../Icons/MapIcon";
import LifeListIcon from "../Icons/LifeListIcon";
import RepostsIcon from "../Icons/RepostsIcon";
import LifeList from "../../LifeList/Screens/LifeList";
import Reposts from "../Screens/Reposts";

const Tab = createMaterialTopTabNavigator();

export default function ProfileNavigator({ onTabChange, userId, isAdmin }) {
  const navigation = useNavigation();

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
          backgroundColor: "#6AB952", // Indicator color
        },
      }}
    >
      <Tab.Screen
        name="Collages"
        options={{
          tabBarLabel: ({ focused }) => (
            <CollagesIcon color={focused ? "#000000" : "#d4d4d4"} />
          ),
        }}
        listeners={{
          focus: () => onTabChange && onTabChange("Collages"),
        }}
      >
        {() => <Collages userId={userId} />}
      </Tab.Screen>
      <Tab.Screen
        name="Reposts"
        options={{
          tabBarLabel: ({ focused }) => (
            <RepostsIcon color={focused ? "#000000" : "#d4d4d4"} />
          ),
        }}
        listeners={{
          focus: () => onTabChange && onTabChange("Reposts"),
        }}
      >
        {() => <Reposts userId={userId} />}
      </Tab.Screen>
      <Tab.Screen
        name="LifeList"
        component={LifeList}
        options={{
          tabBarLabel: ({ focused }) => (
            <LifeListIcon color={focused ? "#000000" : "#d4d4d4"} />
          ),
        }}
        listeners={{
          focus: () => onTabChange && onTabChange("LifeList"),
          tabPress: (e) => {
            e.preventDefault();
            if (isAdmin) {
              navigation.navigate("AdminLifeListStack");
            } else {
              navigation.navigate("LifeListStack", { userId });
            }
          },
        }}
      />
      <Tab.Screen
        name="WorldMap"
        component={WorldMap}
        options={{
          tabBarLabel: ({ focused }) => (
            <MapIcon color={focused ? "#000000" : "#d4d4d4"} />
          ),
        }}
        listeners={{
          focus: () => onTabChange && onTabChange("WorldMap"),
          tabPress: (e) => {
            e.preventDefault(); // Prevent default tab press behavior
            navigation.navigate("WorldMap"); // Navigate using stack
          },
        }}
      />
    </Tab.Navigator>
  );
}
