import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Pressable, Dimensions } from "react-native";
import Animated, {
  Easing,
  useSharedValue,
  withTiming,
  useAnimatedStyle,
} from "react-native-reanimated";
import CarouselView from "../Screens/TabScreens/CarouselView";
import GalleryView from "../Screens/TabScreens/GalleryView";

const { width } = Dimensions.get("window");

const tabs = [
  { name: "Carousel View", component: CarouselView },
  { name: "Gallery View", component: GalleryView },
];

export default function ExperienceNavigator({ experienceId, associatedShots }) {
  const [activeTab, setActiveTab] = useState("Carousel View");
  const translateX = useSharedValue(0);

  console.log(`ExperienceID: ${experienceId}`);
  console.log(`associatedShots: ${associatedShots}`);
  console.log(associatedShots);
  console.log("FINISH");

  useEffect(() => {
    translateX.value = activeTab === "Carousel View" ? 0 : -width;
  }, [activeTab, translateX]);

  const renderScreen = (Component) => (
    <Component experienceId={experienceId} associatedShots={associatedShots} />
  );

  const handleTabPress = (tabName) => {
    if (tabName !== activeTab) {
      setActiveTab(tabName);
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: withTiming(translateX.value, {
          duration: 300,
          easing: Easing.inOut(Easing.ease),
        }),
      },
    ],
  }));

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
      <Animated.View style={[styles.screenContainer, animatedStyle]}>
        <View style={styles.screen}>{renderScreen(CarouselView)}</View>
        <View style={styles.screen}>{renderScreen(GalleryView)}</View>
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
    justifyContent: "center",
    paddingTop: 4,
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
    flexDirection: "row",
    width: width * 2,
    height: "100%",
  },
  screen: {
    width: width,
    height: "100%",
  },
});
