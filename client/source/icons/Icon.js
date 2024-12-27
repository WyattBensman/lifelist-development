import React from "react";
import { Pressable } from "react-native";
import { SymbolView } from "expo-symbols";

export default function Icon({
  name,
  style,
  weight = "regular",
  tintColor = "#fff",
  onPress = null,
}) {
  return (
    <Pressable onPress={onPress} disabled={!onPress}>
      <SymbolView
        name={name}
        style={style}
        weight={weight}
        tintColor={tintColor}
      />
    </Pressable>
  );
}
