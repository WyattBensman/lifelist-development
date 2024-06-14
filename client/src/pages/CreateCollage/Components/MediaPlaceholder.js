import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SymbolView } from "expo-symbols";

export default function MediaPlaceholder() {
  return (
    <View style={styles.placeholderContainer}>
      <SymbolView
        name="photo.fill"
        style={styles.placeholderIcon}
        tintColor={"#d4d4d4"}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  placeholderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  placeholderText: {
    marginTop: 8,
    fontSize: 16,
    color: "#888",
  },
  placeholderIcon: {
    height: 61,
    width: 80,
  },
});
