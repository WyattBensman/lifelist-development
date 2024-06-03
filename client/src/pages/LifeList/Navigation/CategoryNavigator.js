import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import AllExperiences from "../Screens/TabScreens/AllExperiences";
import CategoryExperiences from "../Screens/TabScreens/CategoryExperiences";

const Tab = createMaterialTopTabNavigator();

export default function CategoryNavigator({ lifeList }) {
  return (
    <Tab.Navigator
      screenOptions={{
        swipeEnabled: false,
        tabBarActiveTintColor: "#fff",
        tabBarInactiveTintColor: "#d4d4d4",
        tabBarStyle: {
          backgroundColor: "#0B0B0B",
          height: 42.5,
        },
        tabBarIndicatorStyle: {
          backgroundColor: "#6AB952",
        },
        tabBarLabelStyle: {
          fontSize: 14,
          textTransform: "capitalize",
        },
        tabBarScrollEnabled: true,
      }}
    >
      <Tab.Screen name="All">
        {() => <AllExperiences lifeList={lifeList} />}
      </Tab.Screen>
      {[
        "Attractions",
        "Destinations",
        "Events",
        "Courses",
        "Venues",
        "Festivals",
        "Hikes and Trails",
        "Resorts",
        "Concerts",
        "Artists",
      ].map((category) => (
        <Tab.Screen key={category} name={category}>
          {() => (
            <CategoryExperiences
              lifeList={lifeList}
              category={category.toUpperCase().replace(/ /g, "_")}
            />
          )}
        </Tab.Screen>
      ))}
    </Tab.Navigator>
  );
}
