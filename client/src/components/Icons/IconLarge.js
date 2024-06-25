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
  backgroundColor,
  disabled,
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.iconContainer,
        { backgroundColor: backgroundColor || "#252525" },
        noFill && styles.noBackground,
        disabled && styles.disabled,
      ]}
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
    height: 37.5,
    width: 37.5,
    justifyContent: "center",
    alignItems: "center",
  },
  noBackground: {
    backgroundColor: "transparent",
  },
  disabled: {
    opacity: 0.5,
  },
});
