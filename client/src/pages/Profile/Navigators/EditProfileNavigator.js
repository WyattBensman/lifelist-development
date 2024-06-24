import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Pressable, Dimensions } from "react-native";
import EditProfile from "../Screens/TabScreens/EditProfile";
import EditContact from "../Screens/TabScreens/EditContact";
import EditSettings from "../Screens/TabScreens/EditSettings";
import { useRoute } from "@react-navigation/native";
import { layoutStyles } from "../../../styles";
import Animated, {
  Easing,
  useSharedValue,
  withTiming,
  useAnimatedStyle,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");

const tabs = [
  { name: "Profile", component: EditProfile },
  { name: "Contact", component: EditContact },
  { name: "Settings", component: EditSettings },
];

export default function EditProfileNavigator() {
  const route = useRoute();
  const initialTab = route.params?.initialTab || "Profile";
  const [activeTab, setActiveTab] = useState(initialTab);
  const translateX = useSharedValue(0);

  useEffect(() => {
    if (route.params?.initialTab) {
      setActiveTab(route.params.initialTab);
    }
  }, [route.params?.initialTab]);

  useEffect(() => {
    translateX.value = tabs.findIndex((tab) => tab.name === activeTab) * -width;
  }, [activeTab, translateX]);

  const renderScreen = () => {
    return tabs.map((tab) => (
      <View key={tab.name} style={styles.screen}>
        {React.createElement(tab.component)}
      </View>
    ));
  };

  const handleTabPress = (tabName) => {
    setActiveTab(tabName);
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
      <Animated.View style={[styles.screenContainer, animatedStyle]}>
        {renderScreen()}
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
    paddingBottom: 12,
    paddingTop: 6,
    marginBottom: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: "#252525",
  },
  navigatorButton: {
    width: "26%",
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
    borderWidth: 1,
    borderColor: "#6AB95250",
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
    width: width * tabs.length,
    height: "100%",
  },
  screen: {
    width: width,
    height: "100%",
  },
});
