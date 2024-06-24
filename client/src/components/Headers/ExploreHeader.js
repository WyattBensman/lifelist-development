import React from "react";
import { View, StyleSheet } from "react-native";
import SearchBarStandard from "../SearchBars/SearchBarStandard";
import { layoutStyles } from "../../styles";

export default function ExploreHeader({
  searchQuery,
  setSearchQuery,
  handleSearch,
  onSearchFocusChange,
}) {
  return (
    <View style={[styles.headerContainer, layoutStyles.paddingHorizontalMd]}>
      <SearchBarStandard
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
        onFocusChange={onSearchFocusChange}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: 60,
    paddingBottom: 8,
    marginHorizontal: 16,
    backgroundColor: "#121212",
  },
});
