// ListViewNavigator.js
import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet, Pressable } from "react-native";
import AllExperiencesList from "../Screens/TabScreens/AllExperiencesList";
import CategoryExperiencesList from "../Screens/TabScreens/CategoryExperiencesList";
import { layoutStyles } from "../../../styles";

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
    <View style={layoutStyles.wrapper}>
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
    alignItems: "center",
  },
  navigatorButton: {
    backgroundColor: "#1C1C1C",
    marginHorizontal: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  activeNavigatorButtonExperienced: {
    backgroundColor: "#6AB95230",
    borderWidth: 1,
    borderColor: "#6AB95250",
  },
  activeNavigatorButtonWishlisted: {
    backgroundColor: "#5FC4ED30",
    borderWidth: 1,
    borderColor: "#5FC4ED50",
  },
  navigatorText: {
    color: "#696969",
    fontWeight: "500",
  },
  activeNavigatorTextExperienced: {
    color: "#6AB952",
    fontWeight: "500",
  },
  activeNavigatorTextWishlisted: {
    color: "#5FC4ED",
    fontWeight: "500",
  },
  screenContainer: {
    flex: 1,
  },
});

/* navigatorButton: {
  backgroundColor: "#1C1C1C",
  marginHorizontal: 6,
  paddingVertical: 10,
  paddingHorizontal: 16,
  borderRadius: 16,
  justifyContent: "center",
  alignItems: "center",
},
activeNavigatorButton: {
  backgroundColor: "#6AB95230",
  borderWidth: 1,
  borderColor: "#6AB95250",
},
navigatorText: {
  color: "#696969",
  fontWeight: "500",
},
activeNavigatorText: {
  color: "#6AB952",
  fontWeight: "500",
}, */
