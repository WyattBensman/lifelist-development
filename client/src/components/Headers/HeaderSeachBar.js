import React from "react";
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import SearchBarHeader from "../SearchBars/SearchBarHeader";
import { useNavigation } from "@react-navigation/native";

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
  const showIcons = arrowIcon || icon1 || icon2;
  const navigation = useNavigation();

  const dismissKeyboard = () => {
    Keyboard.dismiss();
    onSearchFocusChange(false);
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View
        style={[
          styles.headerContainer,
          hasBorder && styles.border,
          !icon1 && !icon2 && styles.paddingRight,
        ]}
      >
        <View style={[styles.icon, arrowIcon ? styles.iconSpacing : {}]}>
          {arrowIcon}
        </View>
        <SearchBarHeader
          style={[styles.searchBar]}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
          onFocusChange={onSearchFocusChange}
        />
        {isSearchFocused ? (
          hideIconsOnFocus ? (
            <View style={styles.rightIconsContainer}>
              {/* Placeholder for spacing */}
              <View style={[styles.icon, styles.iconSpacing]}></View>
            </View>
          ) : (
            <View style={styles.rightIconsContainer}>
              {icon1 && (
                <View style={[styles.icon, styles.iconSpacing]}>{icon1}</View>
              )}
              {icon2 && <View style={styles.icon}>{icon2}</View>}
            </View>
          )
        ) : (
          showIcons && (
            <View style={styles.rightIconsContainer}>
              {icon1 && (
                <View style={[styles.icon, styles.iconSpacing]}>{icon1}</View>
              )}
              {icon2 && <View style={styles.icon}>{icon2}</View>}
            </View>
          )
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
    paddingBottom: 10,
  },
  border: {
    borderBottomWidth: 1,
    borderBottomColor: "#1C1C1C",
  },
  searchBar: {
    flex: 1,
    backgroundColor: "#252525",
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
  paddingRight: {
    paddingRight: 20,
  },
});
