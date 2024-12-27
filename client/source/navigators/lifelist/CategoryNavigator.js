import React, { useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import AllExperiences from "../Screens/TabScreens/AllExperiences";
import CategoryExperiences from "../Screens/TabScreens/CategoryExperiences";
import { navigatorStyles } from "../styles/navigatorStyles";

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
