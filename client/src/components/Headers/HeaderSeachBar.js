import { View, StyleSheet, TouchableOpacity } from "react-native";
import SearchBar from "../SearchBar";

export default function HeaderSearchBar({
  arrowIcon,
  icon1,
  icon2,
  hasBorder = true,
}) {
  return (
    <View style={[styles.headerContainer, hasBorder && styles.border]}>
      {arrowIcon && (
        <View style={[styles.icon, arrowIcon ? styles.iconSpacing : {}]}>
          {arrowIcon}
        </View>
      )}
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
    marginTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  border: {
    borderBottomWidth: 1,
    borderBottomColor: "#D4D4D4",
  },
  searchBar: {
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
