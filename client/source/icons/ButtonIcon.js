import React from "react";
import { Pressable } from "react-native";
import { SymbolView } from "expo-symbols";
import iconStyles from "../styles/components/iconStyles";

export default function ButtonIcon({
  name,
  style,
  weight = "regular",
  tintColor = "#fff",
  onPress,
  noFill,
  backgroundColor,
  size = "default", // default or large
}) {
  const iconSizeStyle =
    size === "large" ? iconStyles.iconLargeSize : iconStyles.iconDefaultSize;

  return (
    <Pressable
      onPress={onPress}
      style={[
        iconStyles.iconContainer,
        iconSizeStyle,
        noFill && iconStyles.noBackground,
        backgroundColor && { backgroundColor },
      ]}
    >
      <SymbolView
        name={name}
        style={style}
        weight={weight}
        tintColor={tintColor}
      />
    </Pressable>
  );
}
