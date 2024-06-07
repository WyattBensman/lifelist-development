import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import Followers from "../Screens/TabScreens/Followers";
import Following from "../Screens/TabScreens/Following";

const tabs = [
  { name: "Followers", component: Followers },
  { name: "Following", component: Following },
];

export default function UserRelationsNavigator({
  userId,
  searchQuery,
  initialTab,
}) {
  const [activeTab, setActiveTab] = useState(initialTab || "Followers");

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const renderScreen = () => {
    const activeTabComponent = tabs.find(
      (tab) => tab.name === activeTab
    ).component;
    return React.createElement(activeTabComponent, { userId, searchQuery });
  };

  const handleTabPress = (tabName) => {
    setActiveTab(tabName);
  };

  return (
    <View style={styles.container}>
      <View style={styles.navigatorWrapper}>
        {tabs.map((tab) => (
          <Pressable
            key={tab.name}
            style={[
              styles.navigatorButton,
              activeTab === tab.name && styles.activeNavigatorButton,
            ]}
            onPress={() => handleTabPress(tab.name)}
          >
            <Text
              style={[
                styles.navigatorText,
                activeTab === tab.name && styles.activeNavigatorText,
              ]}
            >
              {tab.name}
            </Text>
          </Pressable>
        ))}
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
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#FBFBFE",
    paddingBottom: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#ececec",
  },
  navigatorButton: {
    width: "40%",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 6,
    backgroundColor: "#ececec",
  },
  activeNavigatorButton: {
    backgroundColor: "#6AB95230",
  },
  navigatorText: {
    color: "#d4d4d4",
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
