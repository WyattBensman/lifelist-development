import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Pressable, Dimensions } from "react-native";
import Collages from "../Screens/Collages";
import Reposts from "../Screens/Reposts";
import { layoutStyles } from "../../../styles";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");

export default function CustomProfileNavigator({
  userId,
  collages,
  repostedCollages,
  fetchMoreCollages,
  fetchMoreReposts,
  navigation,
  hasActiveMoments,
}) {
  const [activeTab, setActiveTab] = useState("Collages");
  const translateX = useSharedValue(0);

  // Dynamically set the tabs based on hasActiveMoments
  const tabs = [
    { name: "Collages", component: Collages },
    { name: "Reposts", component: Reposts },
    ...(hasActiveMoments ? [{ name: "Moments", component: null }] : []), // Add "Moments" only if hasActiveMoments is true
  ];

  useEffect(() => {
    translateX.value = activeTab === "Collages" ? 0 : -width;
  }, [activeTab, translateX]);

  const renderScreen = (Component, data, fetchMore) => (
    <Component userId={userId} data={data} fetchMore={fetchMore} />
  );

  const handleTabPress = (tabName) => {
    if (tabName === "Moments") {
      navigation.navigate("Moments", { userId }); // Navigate to Moments screen
      setActiveTab("Collages"); // Immediately reset activeTab to Collages
      return; // Prevent further execution for Moments tab
    }
    setActiveTab(tabName); // Set activeTab for other tabs
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

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
                tab.name === "Moments" && { color: "#5FC4ED" },
              ]}
            >
              {tab.name}
            </Text>
          </Pressable>
        ))}
      </View>
      <Animated.View
        key={activeTab} // Force re-render on tab change
        style={[styles.screenContainer, animatedStyle]}
      >
        <View style={styles.screen}>
          {activeTab === "Collages" &&
            renderScreen(Collages, collages, fetchMoreCollages)}
        </View>
        <View style={styles.screen}>
          {activeTab === "Reposts" &&
            renderScreen(Reposts, repostedCollages, fetchMoreReposts)}
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navigatorWrapper: {
    flexDirection: "row",
    marginTop: 16,
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  navigatorButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12, // spacing between buttons
    borderWidth: 1,
    borderColor: "transparent",
  },
  activeNavigatorButton: {
    backgroundColor: "#6AB95230",
    borderWidth: 1,
    borderColor: "#6AB95250",
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
    flexDirection: "row",
    width: width * 2,
    height: "100%",
  },
  screen: {
    width: width,
    height: "100%",
  },
});
