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

const tabs = [
  { name: "Collages", component: Collages },
  { name: "Reposts", component: Reposts },
  { name: "LifeList", component: null },
];

export default function CustomProfileNavigator({
  userId,
  isAdmin,
  isAdminScreen,
  collages,
  repostedCollages,
  loadMoreCollages,
  loadMoreReposts,
  navigation,
}) {
  const [activeTab, setActiveTab] = useState("Collages");
  const translateX = useSharedValue(0);

  useEffect(() => {
    // Update the translation value based on the active tab
    translateX.value = activeTab === "Collages" ? 0 : -width;
    console.log(`Active Tab: ${activeTab}`);
    console.log(`Collages Data:`, collages);
    console.log(`Reposted Collages Data:`, repostedCollages);
  }, [activeTab, translateX, collages, repostedCollages]);

  const renderScreen = (Component, data, loadMore) => (
    <Component userId={userId} data={data} loadMore={loadMore} />
  );

  const handleTabPress = (tabName) => {
    if (tabName === "LifeList") {
      if (isAdmin && isAdminScreen) {
        navigation.navigate("AdminLifeListStack");
      } else {
        navigation.navigate("LifeListStack", { userId });
      }
      setActiveTab("Collages"); // Reset to Collages after navigation
    } else {
      setActiveTab(tabName);
    }
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
            renderScreen(Collages, collages, loadMoreCollages)}
        </View>
        <View style={styles.screen}>
          {activeTab === "Reposts" &&
            renderScreen(Reposts, repostedCollages, loadMoreReposts)}
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
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12, // spacing between buttons
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
