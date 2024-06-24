import React from "react";
import { Pressable, StyleSheet } from "react-native";
import { SymbolView } from "expo-symbols";

export default function IconStatic({
  name,
  style,
  weight,
  tintColor,
  onPress,
  noFill,
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.iconContainer, noFill && styles.noBackground]}
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
    justifyContent: "center",
    alignItems: "center",
  },
  noBackground: {
    backgroundColor: "transparent",
  },
});
