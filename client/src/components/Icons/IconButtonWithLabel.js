import React from "react";
import { Pressable, Text, StyleSheet, View } from "react-native";
import Icon from "./Icon";

export default function IconButtonWithLabel({
  iconName,
  label,
  onPress,
  disabled,
}) {
  return (
    <Pressable
      style={[styles.iconWithLabel, disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled}
    >
      <View style={styles.iconButton}>
        <Icon
          name={iconName}
          style={styles.icon}
          weight="bold"
          onPress={onPress}
        />
      </View>
      <Text style={styles.labelText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  iconWithLabel: {
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
    width: 70,
  },
  iconButton: {
    backgroundColor: "#252525",
    borderRadius: 50,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  labelText: {
    width: 90,
    textAlign: "center",
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
    marginTop: 6,
  },
  disabled: {
    opacity: 0.5,
  },
});
