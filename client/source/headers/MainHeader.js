import React, { useRef, useEffect } from "react";
import { View, Animated, Text } from "react-native";
import { headerStyles } from "../styles/components/headerStyles";

export default function MainHeader({
  titleComponent,
  titleText, // Optional title text
  button1,
  button2,
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
    <View style={headerStyles.headerContainer}>
      <View style={headerStyles.mainContent}>
        <View style={headerStyles.titleContainer}>
          {titleComponent ||
            (titleText && (
              <Text style={headerStyles.titleText}>{titleText}</Text>
            ))}
        </View>
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
