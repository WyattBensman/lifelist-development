import React from "react";
import { View, Text, StyleSheet } from "react-native";

const DropdownInfo = ({ lineOne, lineTwo }) => {
  return (
    <View style={styles.dropdownContainer}>
      <Text style={styles.dropdownMessage}>{lineOne}</Text>
      <Text style={styles.dropdownMessage}>{lineTwo}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  dropdownContainer: {
    flex: 1,
    justifyContent: "center",
  },
  dropdownMessage: {
    fontSize: 14,
    color: "#fff",
    textAlign: "center",
  },
});

export default DropdownInfo;
