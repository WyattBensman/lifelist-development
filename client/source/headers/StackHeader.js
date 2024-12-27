import React, { useRef, useEffect } from "react";
import { View, Animated, Text } from "react-native";
import { headerStyles } from "../styles/components/headerStyles";

const IconFiller = () => <View style={{ width: 32, height: 32 }} />;

export default function StackHeader({
  backButton,
  title,
  button1,
  button2,
  hasBorder = true,
  dropdownVisible = false,
  dropdownContent = null,
}) {
  const dropdownHeight = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(dropdownHeight, {
      toValue: dropdownVisible ? 80 : 0, // Adjust the height as needed
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [dropdownVisible]);

  return (
    <View
      style={[headerStyles.headerContainer, hasBorder && headerStyles.border]}
    >
      <View style={headerStyles.mainContent}>
        <View>{backButton || <IconFiller />}</View>
        {!dropdownVisible && (
          <View style={headerStyles.centerTitleContainer}>
            <Text
              style={headerStyles.titleText}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {title}
            </Text>
          </View>
        )}
        <View style={headerStyles.buttonContainer}>
          {button1 && <View>{button1}</View>}
          {button2 && <View style={headerStyles.buttonSpacing}>{button2}</View>}
        </View>
      </View>
      <Animated.View
        style={[headerStyles.dropdownContainer, { height: dropdownHeight }]}
      >
        {dropdownVisible && dropdownContent}
      </Animated.View>
    </View>
  );
}
