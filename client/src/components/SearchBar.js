import React, { useState } from "react";
import { View, TextInput, StyleSheet, Platform } from "react-native";
import SearchIcon from "../pages/Inbox/Icons/SearchIcon";

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    console.log("Searching for:", searchQuery);
    // Implement your search logic here
  };

  return (
    <View style={styles.container}>
      <SearchIcon />
      <TextInput
        style={styles.input}
        placeholder="Search..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmitEditing={handleSearch}
      />
      {/* <TouchableOpacity onPress={handleSearch} style={styles.icon}>
        <Icon name="search" size={20} color="#000" />
      </TouchableOpacity> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    margin: 10,
    marginBottom: 2,
    paddingHorizontal: 10,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.025,
        shadowRadius: 1,
      },
      android: {
        elevation: 3,
      },
    }),
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
