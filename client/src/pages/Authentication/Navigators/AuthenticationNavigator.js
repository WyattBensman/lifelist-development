import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Pressable, Dimensions } from "react-native";
import Animated, {
  Easing,
  useSharedValue,
  withTiming,
  useAnimatedStyle,
} from "react-native-reanimated";
import SignUp from "../Screens/SignUp";
import Login from "../Screens/Login";

const { width } = Dimensions.get("window");

const tabs = [
  { name: "SignUp", component: SignUp, label: "Sign Up" },
  { name: "Login", component: Login, label: "Login" },
];

export default function AuthenticationNavigator({ onTabChange }) {
  const [activeTab, setActiveTab] = useState("SignUp");
  const translateX = useSharedValue(0);

  useEffect(() => {
    translateX.value = activeTab === "SignUp" ? 0 : -width;
  }, [activeTab, translateX]);

  const renderScreen = (Component) => <Component />;

  const handleTabPress = (tabName) => {
    if (tabName !== activeTab) {
      setActiveTab(tabName);
      onTabChange(tabName === "SignUp" ? "Sign Up" : "Login");
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
              {tab.label}
            </Text>
          </Pressable>
        ))}
      </View>
      <Animated.View style={[styles.screenContainer, animatedStyle]}>
        <View style={styles.screen}>{renderScreen(SignUp)}</View>
        <View style={styles.screen}>{renderScreen(Login)}</View>
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
    paddingTop: 20,
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
