import React, { useState, useEffect } from "react";
import { View, Text, Pressable } from "react-native";
import Animated, {
  Easing,
  useSharedValue,
  withTiming,
  useAnimatedStyle,
} from "react-native-reanimated";
import Followers from "../Screens/TabScreens/Followers";
import Following from "../Screens/TabScreens/Following";
import { navigatorStyles } from "../styles/navigatorStyles";

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
  const translateX = useSharedValue(0);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  useEffect(() => {
    translateX.value =
      tabs.findIndex((tab) => tab.name === activeTab) *
      -navigatorStyles.screenContainer.width;
  }, [activeTab]);

  const handleTabPress = (tabName) => {
    if (tabName !== activeTab) {
      setActiveTab(tabName);
    }
  };

  const renderScreen = (Component) => (
    <Component userId={userId} searchQuery={searchQuery} />
  );

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
    <View style={navigatorStyles.wrapper}>
      <View style={navigatorStyles.userRelationsNavigatorWrapper}>
        {tabs.map((tab) => (
          <Pressable
            key={tab.name}
            style={[
              navigatorStyles.navigatorButton,
              navigatorStyles.userRelationsNavigatorButton,
              activeTab === tab.name && navigatorStyles.activeNavigatorButton,
            ]}
            onPress={() => handleTabPress(tab.name)}
          >
            <Text
              style={[
                navigatorStyles.navigatorText,
                activeTab === tab.name && navigatorStyles.activeNavigatorText,
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
            {activeTab === name && renderScreen(component)}
          </View>
        ))}
      </Animated.View>
    </View>
  );
}
