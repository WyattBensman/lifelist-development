import React from "react";
import { Pressable, StyleSheet } from "react-native";
import { SymbolView } from "expo-symbols";

export default function IconLarge({
  name,
  style,
  weight,
  tintColor,
  onPress,
  noFill,
  backgroundColor, // Add backgroundColor prop
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.iconContainer,
        { backgroundColor: backgroundColor || "#252525" }, // Apply backgroundColor if passed, otherwise use default
        noFill && styles.noBackground,
      ]}
    >
      <SymbolView
        name={name}
        style={style}
        weight={weight}
        tintColor={tintColor ? tintColor : "#fff"}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    borderRadius: 50,
    padding: 10,
    height: 37.5,
    width: 37.5,
    justifyContent: "center",
    alignItems: "center",
  },
  noBackground: {
    backgroundColor: "transparent",
  },
});
