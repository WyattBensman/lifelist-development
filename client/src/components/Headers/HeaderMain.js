import React, { useRef, useEffect } from "react";
import { StyleSheet, View, Animated, Text } from "react-native";
import { layoutStyles } from "../../styles";

export default function HeaderMain({
  titleComponent,
  titleText, // Optional title text
  icon1,
  icon2,
  icon3,
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
    <View style={styles.headerContainer}>
      <View style={styles.mainContent}>
        <View style={styles.titleContainer}>
          {titleComponent ||
            (titleText && <Text style={styles.titleText}>{titleText}</Text>)}
        </View>
        <View style={styles.iconContainer}>
          {icon1 && (
            <View style={layoutStyles.alignJustifyCenter}>{icon1}</View>
          )}
          {icon2 && (
            <View
              style={[
                layoutStyles.alignJustifyCenter,
                layoutStyles.marginLeftMd,
              ]}
            >
              {icon2}
            </View>
          )}
          {icon3 && (
            <View
              style={[
                layoutStyles.alignJustifyCenter,
                layoutStyles.marginLeftMd,
              ]}
            >
              {icon3}
            </View>
          )}
        </View>
      </View>
      <Animated.View
        style={[styles.dropdownContainer, { height: dropdownHeight }]}
      >
        {dropdownVisible && dropdownContent}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: "#121212",
    paddingTop: 56,
    paddingBottom: 8,
    borderBottomWidth: 1,
    paddingHorizontal: 20,
    borderBottomColor: "#1C1C1C",
  },
  mainContent: {
    flexDirection: "row",
  },
  titleContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  iconContainer: {
    flexDirection: "row",
  },
  dropdownContainer: {
    overflow: "hidden",
    backgroundColor: "#121212",
  },
  titleText: {
    fontSize: 24,
    fontWeight: "800",
    color: "#fff",
    marginTop: 8,
  },
});
