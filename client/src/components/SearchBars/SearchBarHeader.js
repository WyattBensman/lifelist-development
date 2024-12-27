import React, { useState } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import Icon from "../Icons/Icon";
import { iconStyles } from "../../styles";

export default function SearchBarHeader({
  searchQuery,
  setSearchQuery,
  handleSearch,
  onFocusChange,
}) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      {!isFocused && searchQuery === "" && (
        <Icon
          name="magnifyingglass"
          tintColor={"#d4d4d4"}
          fill={false}
          style={iconStyles.magnifyingGlass}
          noFill={true}
        />
      )}
      <TextInput
        style={styles.input}
        placeholder="Search..."
        placeholderTextColor="#d4d4d4"
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmitEditing={handleSearch}
        onFocus={() => {
          setIsFocused(true);
          onFocusChange(true);
        }}
        onBlur={() => {
          setIsFocused(false);
          onFocusChange(false);
        }}
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
    backgroundColor: "#252525",
    borderRadius: 8,
    paddingHorizontal: 8,
    marginHorizontal: 4,
  },
  input: {
    flex: 1,
    marginLeft: 4,
    color: "#d4d4d4",
    fontSize: 16,
  },
});
