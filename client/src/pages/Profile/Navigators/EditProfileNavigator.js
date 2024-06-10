import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import EditProfile from "../Screens/TabScreens/EditProfile";
import EditContact from "../Screens/TabScreens/EditContact";
import EditSettings from "../Screens/TabScreens/EditSettings";
import { useRoute } from "@react-navigation/native";

const tabs = [
  { name: "Profile", component: EditProfile },
  { name: "Contact", component: EditContact },
  { name: "Settings", component: EditSettings },
];

export default function EditProfileNavigator() {
  const route = useRoute();
  const initialTab = route.params?.initialTab || "Profile";
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    if (route.params?.initialTab) {
      setActiveTab(route.params.initialTab);
    }
  }, [route.params?.initialTab]);

  const renderScreen = () => {
    const activeTabComponent = tabs.find(
      (tab) => tab.name === activeTab
    ).component;
    return React.createElement(activeTabComponent);
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
    paddingTop: 12,
    marginBottom: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: "#ececec",
  },
  navigatorButton: {
    width: "26%",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 6, // spacing between buttons
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
