import React, { useRef } from "react";
import { View } from "react-native";
import SearchBar from "../SearchBars/SearchBar";
import Icon from "../Icons/Icon";
import { headerStyles } from "../styles/components/headerStyles";

export default function ExploreHeader({
  searchQuery,
  setSearchQuery,
  handleSearch,
  onFocusChange,
  isSearchFocused,
  onBackPress,
}) {
  const searchBarRef = useRef(null); // Ref for SearchBar

  const handleBackPress = () => {
    if (searchBarRef.current) {
      searchBarRef.current.blur(); // Blur the search bar
    }
    onBackPress(); // Additional back press logic
  };

  return (
    <View
      style={[
        headerStyles.headerContainer,
        !isSearchFocused && headerStyles.defaultMargin,
      ]}
    >
      {/* Back Arrow (Only visible when focused) */}
      {isSearchFocused && (
        <View style={headerStyles.backArrowContainer}>
          <Icon
            name="chevron.backward"
            onPress={handleBackPress}
            style={headerStyles.backArrow}
            weight="semibold"
          />
        </View>
      )}

      {/* Search Bar */}
      <View
        style={[
          headerStyles.searchBarContainer,
          isSearchFocused && headerStyles.focusedSearchBar,
        ]}
      >
        <SearchBar
          ref={searchBarRef}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
          onFocusChange={onFocusChange}
        />
      </View>
    </View>
  );
}
