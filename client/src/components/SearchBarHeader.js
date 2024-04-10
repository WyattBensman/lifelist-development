import { View, StyleSheet, TouchableOpacity } from "react-native";
import SearchBar from "./SearchBar";

export default function SearchBarHeader({ arrowIcon, icon1, icon2 }) {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.iconContainer}>{arrowIcon}</View>
      <SearchBar style={styles.searchBar} />
      <View style={styles.rightIconsContainer}>
        {icon1 && (
          <View style={[styles.icon, styles.iconSpacing]}>{icon1}</View>
        )}
        {icon2 && <View style={styles.icon}>{icon2}</View>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 55,
    paddingHorizontal: 20,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#D4D4D4",
  },
  iconContainer: {
    marginRight: 10, // Adjust spacing as necessary
  },
  searchBar: {
    flex: 1, // Allows the search bar to fill the available space
  },
  rightIconsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginLeft: 10, // Adjust spacing as necessary
  },
  iconSpacing: {
    marginRight: 10, // Additional spacing for the first icon if both icons are present
  },
});
