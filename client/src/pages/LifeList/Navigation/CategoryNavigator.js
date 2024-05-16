import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import AllExperiences from "../Screens/TabScreens/AllExperiences";
import CategoryExperiences from "../Screens/TabScreens/CategoryExperiences";

const Tab = createMaterialTopTabNavigator();

export default function CategoryNavigator({ lifeList }) {
  return (
    <Tab.Navigator
      screenOptions={{
        swipeEnabled: false,
        tabBarActiveTintColor: "#000000",
        tabBarInactiveTintColor: "#d4d4d4",
        tabBarStyle: {
          backgroundColor: "#ffffff",
          height: 42.5,
        },
        tabBarIndicatorStyle: {
          backgroundColor: "#6AB952", // Indicator color
        },
        tabBarLabelStyle: {
          fontSize: 14,
          textTransform: "capitalize",
        },
        tabBarScrollEnabled: true,
        tabBarItemStyle: ({ route }) => ({
          width: getLabelWidth(route.name) + 10, // Adjust width based on text length
        }),
      }}
    >
      <Tab.Screen name="All">
        {() => <AllExperiences lifeList={lifeList} />}
      </Tab.Screen>
      <Tab.Screen name="Attractions">
        {() => (
          <CategoryExperiences lifeList={lifeList} category="ATTRACTIONS" />
        )}
      </Tab.Screen>
      <Tab.Screen name="Destinations">
        {() => (
          <CategoryExperiences lifeList={lifeList} category="DESTINATIONS" />
        )}
      </Tab.Screen>
      <Tab.Screen name="Events">
        {() => <CategoryExperiences lifeList={lifeList} category="EVENTS" />}
      </Tab.Screen>
      <Tab.Screen name="Courses">
        {() => <CategoryExperiences lifeList={lifeList} category="COURSES" />}
      </Tab.Screen>
      <Tab.Screen name="Venues">
        {() => <CategoryExperiences lifeList={lifeList} category="VENUES" />}
      </Tab.Screen>
      <Tab.Screen name="Festivals">
        {() => <CategoryExperiences lifeList={lifeList} category="FESTIVALS" />}
      </Tab.Screen>
      <Tab.Screen name="Hikes and Trails">
        {() => (
          <CategoryExperiences
            lifeList={lifeList}
            category="HIKES_AND_TRAILS"
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="Resorts">
        {() => <CategoryExperiences lifeList={lifeList} category="RESORTS" />}
      </Tab.Screen>
      <Tab.Screen name="Concerts">
        {() => <CategoryExperiences lifeList={lifeList} category="CONCERTS" />}
      </Tab.Screen>
      <Tab.Screen name="Artists">
        {() => <CategoryExperiences lifeList={lifeList} category="ARTISTS" />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
