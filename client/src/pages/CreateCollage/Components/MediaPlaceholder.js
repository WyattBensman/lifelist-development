import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SymbolView } from "expo-symbols";

export default function MediaPlaceholder() {
  return (
    <View style={styles.placeholderContainer}>
      <SymbolView
        name="photo.fill"
        style={styles.placeholderIcon}
        tintColor={"#696969"}
      />
      <Text style={styles.placeholderText}>Please select at least 1 image</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  placeholderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1C1C1C",
  },
  placeholderText: {
    marginTop: 8,
    fontSize: 12,
    color: "#696969",
  },
  placeholderIcon: {
    height: 61,
    width: 80,
  },
});