import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import AllExperiences from "../Screens/TabScreens/AllExperiences";
import CategoryExperiences from "../Screens/TabScreens/CategoryExperiences";

const Tab = createMaterialTopTabNavigator();

const getLabelWidth = (label) => {
  const length = label.length;
  return Math.max(50, length * 3); // Adjust to fit your text width
};

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
          backgroundColor: "#6AB952",
        },
        tabBarLabelStyle: {
          fontSize: 14,
          textTransform: "capitalize",
        },
        tabBarScrollEnabled: true,
        tabBarItemStyle: ({ route }) => ({
          width: getLabelWidth(route.name) + 10,
        }),
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
