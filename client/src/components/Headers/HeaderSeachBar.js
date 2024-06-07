import { View, StyleSheet } from "react-native";
import SearchBar from "../SearchBar";

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
}) {
  const showIcons = arrowIcon || icon1 || icon2;

  return (
    <View style={[styles.headerContainer, hasBorder && styles.border]}>
      {arrowIcon && (
        <View style={[styles.icon, arrowIcon ? styles.iconSpacing : {}]}>
          {arrowIcon}
        </View>
      )}
      <SearchBar
        style={[styles.searchBar, !showIcons && styles.fullWidth]}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
        onFocusChange={onSearchFocusChange}
      />
      {showIcons && !isSearchFocused && (
        <View style={styles.rightIconsContainer}>
          {icon1 && (
            <View style={[styles.icon, styles.iconSpacing]}>{icon1}</View>
          )}
          {icon2 && <View style={styles.icon}>{icon2}</View>}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: "#FBFBFE",
  },
  border: {
    borderBottomWidth: 1,
    borderBottomColor: "#D4D4D4",
  },
  searchBar: {
    flex: 1,
  },
  fullWidth: {
    flex: 1,
  },
  rightIconsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginLeft: 10,
  },
  iconSpacing: {
    marginRight: 10,
  },
});
