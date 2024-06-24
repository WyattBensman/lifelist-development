import React, { useRef, useEffect } from "react";
import { StyleSheet, Text, View, Animated } from "react-native";

const IconFiller = () => <View style={{ width: 35, height: 35 }} />;

export default function HeaderStack({
  arrow,
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
    <View style={[styles.mainContainer, hasBorder && styles.border]}>
      <View style={styles.contentContainer}>
        <View style={styles.sideContainer}>
          {arrow ? arrow : <IconFiller />}
        </View>
        <View style={[styles.sideContainer, styles.rightContainer]}>
          {button2 && <View style={styles.iconSpacing}>{button2}</View>}
          {button1 && (
            <View style={[styles.iconSpacing, button2 && styles.iconGap]}>
              {button1}
            </View>
          )}
        </View>
        {!dropdownVisible && (
          <View style={styles.titleContainer}>
            <Text style={styles.header} numberOfLines={1} ellipsizeMode="tail">
              {title}
            </Text>
          </View>
        )}
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
  mainContainer: {
    marginTop: 45,
    paddingTop: 15,
    paddingBottom: 8,
  },
  border: {
    borderBottomWidth: 1,
    borderBottomColor: "#1C1C1C",
  },
  contentContainer: {
    marginHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    position: "relative",
  },
  sideContainer: {
    flexDirection: "row",
    alignItems: "center",
    zIndex: 1,
  },
  rightContainer: {
    justifyContent: "flex-end",
  },
  titleContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 16,
    fontWeight: "800",
    color: "#6AB952",
  },
  iconSpacing: {
    alignItems: "flex-end",
  },
  iconGap: {
    marginLeft: 16,
  },
  dropdownContainer: {
    overflow: "hidden",
    backgroundColor: "#121212",
  },
});
