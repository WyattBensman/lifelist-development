import React from "react";
import { Pressable, StyleSheet } from "react-native";
import { SymbolView } from "expo-symbols";

export default function Icon({
  name,
  style,
  weight,
  tintColor,
  onPress,
  noFill,
  backgroundColor,
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.iconContainer,
        noFill && styles.noBackground,
        backgroundColor && { backgroundColor },
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
    backgroundColor: "#252525",
    borderRadius: 50,
    padding: 10,
    height: 30,
    width: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  noBackground: {
    backgroundColor: "transparent",
  },
});
