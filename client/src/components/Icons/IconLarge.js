import React from "react";
import { Pressable, StyleSheet } from "react-native";
import { SymbolView } from "expo-symbols";

export default function DropdownIcon({
  name,
  style,
  weight,
  tintColor,
  onPress,
  disabled,
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.iconContainer, disabled && styles.disabled]}
      disabled={disabled}
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
    height: 42,
    width: 42,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#252525",
  },
  noBackground: {
    backgroundColor: "transparent",
  },
  disabled: {
    opacity: 0.5,
  },
});
