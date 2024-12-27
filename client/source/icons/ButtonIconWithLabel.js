import React from "react";
import { Pressable, Text, View } from "react-native";
import ButtonIcon from "./ButtonIcon";
import iconStyles from "./iconStyles";

export default function ButtonIconWithLabel({
  iconName,
  label,
  onPress,
  disabled = false,
  size = "large", // default or large
}) {
  return (
    <Pressable
      style={[
        iconStyles.iconButtonWithPadding,
        disabled && iconStyles.disabled,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <ButtonIcon name={iconName} size={size} onPress={onPress} />
      <Text style={iconStyles.labelText}>{label}</Text>
    </Pressable>
  );
}
