import React, { useRef, useEffect } from "react";
import { StyleSheet, View, Text, Animated } from "react-native";

const IconFiller = () => <View style={{ width: 35, height: 35 }} />;

export default function ViewShotHeader({
  arrow,
  date,
  time,
  ellipsis,
  hasBorder = true,
  dropdownVisible = false,
  dropdownContent = null,
}) {
  const dropdownHeight = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(dropdownHeight, {
      toValue: dropdownVisible ? 70 : 0, // Adjust the height as needed
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [dropdownVisible]);

  return (
    <View>
      <View style={[styles.mainContainer, !hasBorder && styles.noBorder]}>
        <View style={styles.contentContainer}>
          <View style={styles.sideContainer}>
            {arrow ? arrow : <IconFiller />}
          </View>
          <View style={styles.titleContainer}>
            <Text
              style={styles.dateText}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {date}
            </Text>
            <Text
              style={styles.timeText}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {time}
            </Text>
          </View>
          <View style={[styles.sideContainer, styles.rightContainer]}>
            {ellipsis && <View style={styles.iconSpacing}>{ellipsis}</View>}
          </View>
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
  mainContainer: {
    backgroundColor: "#121212",
    paddingTop: 60,
    paddingBottom: 24,
  },
  noBorder: {
    borderBottomWidth: 0,
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
    top: 4,
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  dateText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#fff",
  },
  timeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#fff",
  },
  iconSpacing: {
    alignItems: "flex-end",
  },
  dropdownContainer: {
    overflow: "hidden",
    backgroundColor: "#121212",
  },
});
