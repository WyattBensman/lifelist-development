import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import AllExperiencesList from "../Screens/TabScreens/AllExperiencesList";
import CategoryExperiencesList from "../Screens/TabScreens/CategoryExperiencesList";

const Tab = createMaterialTopTabNavigator();

export default function ListViewNavigator({ lifeList, viewType, editMode }) {
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
        tabBarLabelStyle: {
          fontSize: 14,
          textTransform: "capitalize",
        },
        tabBarScrollEnabled: true,
      }}
    >
      <Tab.Screen name="All">
        {() => (
          <AllExperiencesList
            lifeList={lifeList}
            viewType={viewType}
            editMode={editMode}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="Attractions">
        {() => (
          <CategoryExperiencesList
            lifeList={lifeList}
            category="ATTRACTIONS"
            viewType={viewType}
            editMode={editMode}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="Destinations">
        {() => (
          <CategoryExperiencesList
            lifeList={lifeList}
            category="DESTINATIONS"
            viewType={viewType}
            editMode={editMode}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="Events">
        {() => (
          <CategoryExperiencesList
            lifeList={lifeList}
            category="EVENTS"
            viewType={viewType}
            editMode={editMode}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="Courses">
        {() => (
          <CategoryExperiencesList
            lifeList={lifeList}
            category="COURSES"
            viewType={viewType}
            editMode={editMode}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="Venues">
        {() => (
          <CategoryExperiencesList
            lifeList={lifeList}
            category="VENUES"
            viewType={viewType}
            editMode={editMode}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="Festivals">
        {() => (
          <CategoryExperiencesList
            lifeList={lifeList}
            category="FESTIVALS"
            viewType={viewType}
            editMode={editMode}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="Hikes and Trails">
        {() => (
          <CategoryExperiencesList
            lifeList={lifeList}
            category="HIKES_AND_TRAILS"
            viewType={viewType}
            editMode={editMode}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="Resorts">
        {() => (
          <CategoryExperiencesList
            lifeList={lifeList}
            category="RESORTS"
            viewType={viewType}
            editMode={editMode}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="Concerts">
        {() => (
          <CategoryExperiencesList
            lifeList={lifeList}
            category="CONCERTS"
            viewType={viewType}
            editMode={editMode}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="Artists">
        {() => (
          <CategoryExperiencesList
            lifeList={lifeList}
            category="ARTISTS"
            viewType={viewType}
            editMode={editMode}
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
