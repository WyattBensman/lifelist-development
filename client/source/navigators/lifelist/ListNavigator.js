import React, { useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import AllExperiencesList from "../Screens/TabScreens/AllExperiencesList";
import CategoryExperiencesList from "../Screens/TabScreens/CategoryExperiencesList";
import { navigatorStyles } from "../styles/navigatorStyles";

const categories = [
  "All",
  "Attractions",
  "Concerts",
  "Destinations",
  "Events",
  "Courses",
  "Venues",
  "Festivals",
  "Trails",
  "Resorts",
  "Performers",
];

export default function ListViewNavigator({
  lifeList,
  viewType,
  editMode,
  searchQuery,
  onDelete,
  userId,
}) {
  const [activeTab, setActiveTab] = useState("All");

  const renderScreen = () => {
    if (activeTab === "All") {
      return (
        <AllExperiencesList
          lifeList={lifeList}
          viewType={viewType}
          editMode={editMode}
          searchQuery={searchQuery}
          onDelete={onDelete}
          userId={userId}
        />
      );
    } else {
      return (
        <CategoryExperiencesList
          lifeList={lifeList}
          category={activeTab.toUpperCase()}
          viewType={viewType}
          editMode={editMode}
          searchQuery={searchQuery}
          onDelete={onDelete}
          userId={userId}
        />
      );
    }
  };

  return (
    <View style={navigatorStyles.wrapper}>
      <View style={navigatorStyles.listViewNavigatorWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={navigatorStyles.navigatorContainer}
          style={{ marginLeft: 6 }}
        >
          {categories.map((category) => (
            <Pressable
              key={category}
              style={[
                navigatorStyles.navigatorButton,
                navigatorStyles.listViewNavigatorButton,
                activeTab === category && navigatorStyles.activeNavigatorButton,
              ]}
              onPress={() => setActiveTab(category)}
            >
              <Text
                style={[
                  navigatorStyles.navigatorText,
                  activeTab === category && navigatorStyles.activeNavigatorText,
                ]}
              >
                {category}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>
      <View style={navigatorStyles.screenContainer}>{renderScreen()}</View>
    </View>
  );
}
