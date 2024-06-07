// NavigatorContainer.js
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Pressable,
} from "react-native";
import AllExperiences from "../Screens/TabScreens/AllExperiences";
import CategoryExperiences from "../Screens/TabScreens/CategoryExperiences";

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

export default function NavigatorContainer({ lifeList, navigation }) {
  const [activeTab, setActiveTab] = useState("All");

  const renderScreen = () => {
    if (activeTab === "All") {
      return <AllExperiences lifeList={lifeList} navigation={navigation} />;
    } else {
      return (
        <CategoryExperiences
          lifeList={lifeList}
          category={activeTab.toUpperCase().replace(/ /g, "_")}
          navigation={navigation}
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
    backgroundColor: "#FBFBFE",
    alignItems: "center",
  },
  navigatorButton: {
    backgroundColor: "#ececec",
    marginHorizontal: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  activeNavigatorButton: {
    backgroundColor: "#6AB95230",
  },
  navigatorText: {
    fontWeight: "500",
    color: "#d4d4d4",
  },
  activeNavigatorText: {
    fontWeight: "500",
    color: "#6AB952",
  },
  screenContainer: {
    flex: 1,
  },
});
