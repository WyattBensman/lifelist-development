import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet, Pressable } from "react-native";
import AllExperiences from "../Screens/TabScreens/AllExperiences";
import CategoryExperiences from "../Screens/TabScreens/CategoryExperiences";
import { layoutStyles } from "../../../styles";

const categories = [
  "All",
  "Attractions",
  "Concerts",
  "Destinations",
  "Events",
  "Festivals",
  "Performers",
  "Resorts",
  "Trails",
  "Venues",
  "Courses",
];

export default function NavigatorContainer({ lifeList, navigation }) {
  const [activeTab, setActiveTab] = useState("All");

  const renderScreen = () => {
    if (activeTab === "All") {
      return <AllExperiences lifeList={lifeList} navigation={navigation} />;
    } else {
      return (
        <CategoryExperiences
          lifeList={lifeList}
          category={activeTab.toUpperCase()}
          navigation={navigation}
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
                activeTab === category && styles.activeNavigatorButton,
              ]}
              onPress={() => setActiveTab(category)}
            >
              <Text
                style={[
                  styles.navigatorText,
                  activeTab === category && styles.activeNavigatorText,
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
    flex: 0.085,
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
  },
  screenContainer: {
    flex: 1,
  },
});
