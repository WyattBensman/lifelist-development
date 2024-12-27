import React from "react";
import { Pressable } from "react-native";
import { SymbolView } from "expo-symbols";
import iconStyles from "../styles/iconStyles";

export default function DropdownIcon({
  name,
  iconStyle,
  weight = "semibold",
  tintColor,
  onPress,
  disabled,
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        iconStyles.dropdownIconContainer,
        disabled && iconStyles.disabled,
      ]}
      disabled={disabled}
    >
      <SymbolView
        name={name}
        style={iconStyle}
        weight={weight}
        tintColor={tintColor || "#fff"}
      />
    </Pressable>
  );
}
