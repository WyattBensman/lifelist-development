import React, { useRef } from "react";
import { View, StyleSheet } from "react-native";
import SearchBarStandard from "../SearchBars/SearchBarStandard";
import { iconStyles } from "../../styles";
import Icon from "../Icons/Icon";

export default function ExploreHeader({
  searchQuery,
  setSearchQuery,
  handleSearch,
  onFocusChange,
  isSearchFocused,
  onBackPress,
}) {
  const searchBarRef = useRef(null); // Ref for SearchBarStandard

  const handleBackPress = () => {
    if (searchBarRef.current) {
      searchBarRef.current.blur(); // Blur the search bar
    }
    onBackPress(); // Additional back press logic (e.g., reset state)
  };

  return (
    <View
      style={[
        styles.headerContainer,
        !isSearchFocused && styles.headerWithMargin,
      ]}
    >
      {isSearchFocused && (
        <View style={{ marginLeft: 16 }}>
          <Icon
            name="chevron.backward"
            onPress={handleBackPress}
            style={iconStyles.backArrow}
            weight="semibold"
          />
        </View>
      )}
      <View
        style={[
          styles.searchBarContainer,
          isSearchFocused && { flex: 1, marginRight: 16, marginLeft: 16 },
        ]}
      >
        <SearchBarStandard
          ref={searchBarRef} // Pass the ref to SearchBarStandard
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
          onFocusChange={onFocusChange}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: 60,
    paddingBottom: 8,
    backgroundColor: "#121212",
    flexDirection: "row",
    alignItems: "center",
  },
  headerWithMargin: {
    marginHorizontal: 16,
  },
  searchBarContainer: {
    flex: 1,
  },
});
