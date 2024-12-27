import React from "react";
import { View, Text, Pressable } from "react-native";
import { navigatorStyles } from "../styles/navigatorStyles";

const tabs = [{ name: "All" }, { name: "Users" }, { name: "Communities" }];

export default function ExploreNavigator({ activeTab, setActiveTab }) {
  return (
    <View
      style={[
        navigatorStyles.navigatorWrapper,
        navigatorStyles.exploreNavigatorWrapper,
      ]}
    >
      {tabs.map((tab) => (
        <Pressable
          key={tab.name}
          style={[
            navigatorStyles.navigatorButton,
            activeTab === tab.name && navigatorStyles.activeNavigatorButton,
          ]}
          onPress={() => setActiveTab(tab.name)}
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
  );
}
