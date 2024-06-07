// ListViewNavigator.js
import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet, Pressable } from "react-native";
import AllExperiencesList from "../Screens/TabScreens/AllExperiencesList";
import CategoryExperiencesList from "../Screens/TabScreens/CategoryExperiencesList";

const categories = [
  "All",
  "Attractions",
  "Concerts",
  "Destinations",
  "Events",
  "Courses",
  "Venues",
  "Festivals",
  "Hikes and Trails",
  "Resorts",
  "Artists",
];

export default function ListViewNavigator({
  lifeList,
  viewType,
  editMode,
  searchQuery,
  navigation,
  onDelete,
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
          navigation={navigation}
          onDelete={onDelete}
        />
      );
    } else {
      return (
        <CategoryExperiencesList
          lifeList={lifeList}
          category={activeTab.toUpperCase().replace(/ /g, "_")}
          viewType={viewType}
          editMode={editMode}
          searchQuery={searchQuery}
          navigation={navigation}
          onDelete={onDelete}
        />
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.navigatorWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.navigatorContainer}
        >
          {categories.map((category) => (
            <Pressable
              key={category}
              style={[
                styles.navigatorButton,
                activeTab === category &&
                  (viewType === "EXPERIENCED"
                    ? styles.activeNavigatorButtonExperienced
                    : styles.activeNavigatorButtonWishlisted),
              ]}
              onPress={() => setActiveTab(category)}
            >
              <Text
                style={[
                  styles.navigatorText,
                  activeTab === category &&
                    (viewType === "EXPERIENCED"
                      ? styles.activeNavigatorTextExperienced
                      : styles.activeNavigatorTextWishlisted),
                ]}
              >
                {category}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>
      <View style={styles.screenContainer}>{renderScreen()}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navigatorWrapper: {
    marginTop: 10,
    marginBottom: 6,
  },
  navigatorContainer: {
    flexDirection: "row",
    backgroundColor: "#FBFBFE",
    alignItems: "center",
  },
  navigatorButton: {
    backgroundColor: "#ececec",
    marginHorizontal: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  activeNavigatorButtonExperienced: {
    backgroundColor: "#6AB95230",
  },
  activeNavigatorButtonWishlisted: {
    backgroundColor: "#5FC4ED30",
  },
  navigatorText: {
    fontWeight: "500",
    color: "#d4d4d4",
  },
  activeNavigatorTextExperienced: {
    fontWeight: "500",
    color: "#6AB952",
  },
  activeNavigatorTextWishlisted: {
    color: "#5FC4ED",
    fontWeight: "bold",
  },
  screenContainer: {
    flex: 1,
  },
});
