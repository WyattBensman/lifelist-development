import React, { useState } from "react";
import { View, TextInput, StyleSheet, Platform } from "react-native";
import SearchIcon from "../pages/Inbox/Icons/SearchIcon";

export default function SearchBar({ style }) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    console.log("Searching for:", searchQuery);
    // Implement your search logic here
  };

  return (
    <View style={[styles.container, style]}>
      <SearchIcon />
      <TextInput
        style={styles.input}
        placeholder="Search..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmitEditing={handleSearch}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 35,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f4f4f4",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginHorizontal: 5,
  },
  input: {
    flex: 1,
    padding: 10,
    color: "#000",
  },
  icon: {
    padding: 5,
  },
});
