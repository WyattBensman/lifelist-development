import React, { useState } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import SearchIcon from "../pages/Inbox/Icons/SearchIcon";

export default function SearchBar({
  searchQuery,
  setSearchQuery,
  handleSearch,
  onFocusChange,
}) {
  return (
    <View style={styles.container}>
      <SearchIcon />
      <TextInput
        style={styles.input}
        placeholder="Search..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmitEditing={handleSearch}
        onFocus={() => onFocusChange(true)}
        onBlur={() => onFocusChange(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
