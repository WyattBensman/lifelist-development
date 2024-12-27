import React from "react";
import { Dimensions, StyleSheet, View, Pressable } from "react-native";
import { Image } from "expo-image";
import Checkbox from "expo-checkbox";

const { width } = Dimensions.get("window");
const spacing = 2;
const shotWidth = (width - spacing * 2) / 3;
const shotHeight = (shotWidth * 3) / 2;

export default function ShotCard({
  shot,
  isSelected,
  onCheckboxToggle,
  navigation,
  index,
}) {
  return (
    <Pressable
      onPress={() => navigation.navigate("ViewShot", { shotId: shot._id })}
      style={[
        styles.container,
        {
          marginRight: (index + 1) % 3 === 0 ? 0 : spacing,
        },
      ]}
    >
      <View style={styles.shotContainer}>
        {/* Image */}
        <Image source={{ uri: shot.imageThumbnail }} style={styles.shotImage} />

        {/* Overlay Border */}
        {isSelected && <View style={styles.overlayBorder} />}

        {/* Checkbox */}
        {isSelected !== undefined && onCheckboxToggle && (
          <Checkbox
            style={styles.checkbox}
            value={isSelected}
            onValueChange={() => onCheckboxToggle(shot._id)}
            color={isSelected ? "#6AB952" : "#d4d4d4"}
          />
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: shotWidth,
    height: shotHeight,
    marginBottom: spacing,
    position: "relative",
  },
  shotContainer: {
    width: "100%",
    height: "100%",
    position: "relative",
  },
  shotImage: {
    width: "100%",
    height: "100%",
  },
  overlayBorder: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    borderWidth: 2,
    borderColor: "#6AB952", // Green border
  },
  checkbox: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 12,
    height: 12,
    borderWidth: 2,
    borderRadius: 10,
  },
});
