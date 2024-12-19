import React from "react";
import { Text, StyleSheet, Pressable } from "react-native";
import Checkbox from "expo-checkbox"; // Ensure you have this package installed

export default function ReportCard({ label, selected, onSelect }) {
  return (
    <Pressable style={styles.optionContainer} onPress={onSelect}>
      <Text style={styles.optionText}>{label}</Text>
      <Checkbox
        value={selected}
        onValueChange={onSelect}
        style={styles.checkbox}
        color={selected ? "#6AB952" : "#d4d4d4"}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  optionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    marginTop: 8,
    borderRadius: 8,
    marginHorizontal: 4,
    backgroundColor: "#1c1c1c",
  },
  optionText: {
    color: "#fff",
    flex: 1,
  },
  checkbox: {
    width: 12,
    height: 12,
    borderWidth: 2,
    borderRadius: 10,
  },
});
