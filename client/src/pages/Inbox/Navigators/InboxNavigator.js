import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import Notifications from "../Screens/TabScreens/Notifications";
import Messages from "../Screens/TabScreens/Messages";
import { layoutStyles } from "../../../styles";

const tabs = [
  { name: "Notifications", component: Notifications },
  { name: "Messages", component: Messages },
];

export default function InboxNavigator({ searchQuery, initialTab }) {
  const [activeTab, setActiveTab] = useState(initialTab || "Notifications");

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const renderScreen = () => {
    const activeTabComponent = tabs.find(
      (tab) => tab.name === activeTab
    ).component;
    return React.createElement(activeTabComponent, { searchQuery });
  };

  const handleTabPress = (tabName) => {
    setActiveTab(tabName);
  };

  return (
    <View style={layoutStyles.wrapper}>
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
    paddingBottom: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#252525",
  },
  navigatorButton: {
    width: "40%",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 6,
    backgroundColor: "#1C1C1C",
  },
  activeNavigatorButton: {
    backgroundColor: "#6AB95230",
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
