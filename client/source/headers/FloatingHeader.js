import React from "react";
import { View, Text } from "react-native";
import { headerStyles } from "../styles/components/headerStyles";

export default function FloatingHeader({ backButton, date, time, icon }) {
  return (
    <View style={headerStyles.floatingHeaderContainer}>
      <View style={headerStyles.contentContainer}>
        {/* Back Button */}
        <View style={headerStyles.sideContainer}>{backButton}</View>

        {/* Title Section (Date & Time) */}
        <View style={headerStyles.titleContainer}>
          <Text
            style={headerStyles.dateText}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {date}
          </Text>
          <Text
            style={headerStyles.timeText}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {time}
          </Text>
        </View>

        {/* Icon Section */}
        <View style={[headerStyles.sideContainer, headerStyles.rightContainer]}>
          {icon}
        </View>
      </View>
    </View>
  );
}
