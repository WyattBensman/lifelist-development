import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import Collages from "../Screens/Collages";
import LifeList from "../../LifeList/Screens/LifeList";
import Reposts from "../Screens/Reposts";

const tabs = [
  { name: "Collages", component: Collages },
  { name: "Reposts", component: Reposts },
  { name: "LifeList", component: LifeList },
];

export default function CustomProfileNavigator({
  userId,
  isAdmin,
  navigation,
}) {
  const [activeTab, setActiveTab] = useState("Collages");

  const renderScreen = () => {
    const activeTabComponent = tabs.find(
      (tab) => tab.name === activeTab
    ).component;
    return React.createElement(activeTabComponent, { userId });
  };

  const handleTabPress = (tabName) => {
    setActiveTab(tabName);
    if (tabName === "LifeList") {
      if (isAdmin) {
        navigation.navigate("AdminLifeListStack");
      } else {
        navigation.navigate("LifeListStack", { userId });
      }
    }
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
    backgroundColor: "#FBFBFE",
    marginTop: 16,
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  navigatorButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12, // spacing between buttons
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