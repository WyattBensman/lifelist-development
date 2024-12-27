import React from "react";
import { View, TouchableWithoutFeedback, Keyboard } from "react-native";
import SearchBar from "../SearchBar";
import { headerStyles } from "../styles/components/headerStyles";

export default function SearchHeader({
  backArrow,
  button,
  hasBorder = true,
  searchQuery,
  setSearchQuery,
  handleSearch,
  isSearchFocused,
  onSearchFocusChange,
  hideIconsOnFocus = true,
}) {
  const dismissKeyboard = () => {
    Keyboard.dismiss();
    onSearchFocusChange(false);
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View
        style={[headerStyles.headerContainer, hasBorder && headerStyles.border]}
      >
        {/* Back Arrow */}
        {backArrow && <View style={headerStyles.icon}>{backArrow}</View>}

        {/* Search Bar */}
        <View style={headerStyles.searchBarContainer}>
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            handleSearch={handleSearch}
            onFocusChange={onSearchFocusChange}
          />
        </View>

        {/* Right Button */}
        {!isSearchFocused || !hideIconsOnFocus ? (
          button && <View style={headerStyles.icon}>{button}</View>
        ) : (
          <View style={headerStyles.icon} />
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}
