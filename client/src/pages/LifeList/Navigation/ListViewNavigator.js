import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import AllExperiencesList from "../Screens/TabScreens/AllExperiencesList";
import CategoryExperiencesList from "../Screens/TabScreens/CategoryExperiencesList";

const Tab = createMaterialTopTabNavigator();

const getLabelWidth = (label) => {
  const length = label.length;
  return Math.max(50, length * 7); // Adjust to fit your text width
};

export default function ListViewNavigator({
  lifeList,
  viewType,
  editMode,
  searchQuery,
  navigation,
}) {
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
        {() => (
          <AllExperiencesList
            lifeList={lifeList}
            viewType={viewType}
            editMode={editMode}
            searchQuery={searchQuery}
            navigation={navigation}
          />
        )}
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
            <CategoryExperiencesList
              lifeList={lifeList}
              category={category.toUpperCase().replace(/ /g, "_")}
              viewType={viewType}
              editMode={editMode}
              searchQuery={searchQuery}
              navigation={navigation}
            />
          )}
        </Tab.Screen>
      ))}
    </Tab.Navigator>
  );
}
