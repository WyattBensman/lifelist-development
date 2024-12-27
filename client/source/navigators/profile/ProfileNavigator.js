import React, { useState, useEffect } from "react";
import { View, Text, Pressable } from "react-native";
import Collages from "../Screens/Collages";
import Reposts from "../Screens/Reposts";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { navigatorStyles } from "../styles/navigatorStyles";

export default function ProfileNavigator({
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

  const tabs = [
    { name: "Collages", component: Collages },
    { name: "Reposts", component: Reposts },
    ...(hasActiveMoments ? [{ name: "Moments", component: null }] : []), // Dynamically add "Moments" tab
  ];

  useEffect(() => {
    translateX.value =
      tabs.findIndex((tab) => tab.name === activeTab) *
      -navigatorStyles.screenContainer.width;
  }, [activeTab]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const handleTabPress = (tabName) => {
    if (tabName === "Moments") {
      navigation.navigate("Moments", { userId }); // Navigate to Moments
      setActiveTab("Collages"); // Reset activeTab
      return;
    }
    setActiveTab(tabName);
  };

  const renderScreen = (Component, data, fetchMore) => (
    <Component userId={userId} data={data} fetchMore={fetchMore} />
  );

  return (
    <View style={navigatorStyles.wrapper}>
      <View style={navigatorStyles.profileNavigatorWrapper}>
        {tabs.map((tab) => (
          <Pressable
            key={tab.name}
            style={[
              navigatorStyles.navigatorButton,
              activeTab === tab.name && navigatorStyles.activeNavigatorButton,
            ]}
            onPress={() => handleTabPress(tab.name)}
          >
            <Text
              style={[
                navigatorStyles.navigatorText,
                activeTab === tab.name && navigatorStyles.activeNavigatorText,
                tab.name === "Moments" && { color: "#5FC4ED" }, // Special color for "Moments"
              ]}
            >
              {tab.name}
            </Text>
          </Pressable>
        ))}
      </View>
      <Animated.View style={[navigatorStyles.screenContainer, animatedStyle]}>
        {tabs.map(({ name, component }) => (
          <View key={name} style={navigatorStyles.screen}>
            {activeTab === name &&
              component &&
              renderScreen(
                component,
                name === "Collages" ? collages : repostedCollages,
                name === "Collages" ? fetchMoreCollages : fetchMoreReposts
              )}
          </View>
        ))}
      </Animated.View>
    </View>
  );
}
