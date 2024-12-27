import React from "react";
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import SearchBarStandard from "../SearchBars/SearchBarStandard";

export default function HeaderSearchBar({
  arrowIcon,
  icon1,
  icon2,
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
      <View style={[styles.headerContainer, hasBorder && styles.border]}>
        {/* Left Icon (e.g., Arrow Icon) */}
        {arrowIcon && (
          <View style={[styles.icon, styles.leftIcon]}>{arrowIcon}</View>
        )}

        {/* Search Bar */}
        <View style={[styles.searchBarContainer]}>
          <SearchBarStandard
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            handleSearch={handleSearch}
            onFocusChange={onSearchFocusChange}
          />
        </View>

        {/* Right Icons */}
        {!isSearchFocused || !hideIconsOnFocus ? (
          <View style={styles.rightIconsContainer}>
            {icon1 && (
              <View style={[styles.icon, styles.iconSpacing]}>{icon1}</View>
            )}
            {icon2 && <View style={styles.icon}>{icon2}</View>}
          </View>
        ) : (
          <View style={styles.rightIconsContainer} />
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 12,
    paddingHorizontal: 20,
    backgroundColor: "#121212", // Example background for consistency
  },
  border: {
    borderBottomWidth: 1,
    borderBottomColor: "#1C1C1C",
  },
  searchBarContainer: {
    flex: 1, // Allow the search bar to take available width
    marginHorizontal: 10, // Add spacing between icons and the search bar
  },
  rightIconsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    justifyContent: "center",
    alignItems: "center",
  },
});
