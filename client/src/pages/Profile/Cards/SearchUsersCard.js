import React from "react";
import { Image, Text, View, Pressable, StyleSheet } from "react-native";
import CheckBox from "expo-checkbox";
import { BASE_URL } from "../../../utils/config";

export default function SearchUsersCard({ user, isSelected, onSelect }) {
  const profilePictureUrl = `${BASE_URL}${user.profilePicture}`;

  return (
    <View style={styles.listItemContainer}>
      <Pressable
        onPress={() => onSelect(!isSelected)}
        style={styles.contentContainer}
      >
        <Image source={{ uri: profilePictureUrl }} style={styles.imageMd} />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{user.fullName}</Text>
          <Text style={styles.secondaryText}>@{user.username}</Text>
        </View>
        <CheckBox
          style={styles.checkbox}
          value={isSelected}
          onValueChange={() => onSelect(!isSelected)}
          color={isSelected ? "#6AB952" : "#d4d4d4"}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  listItemContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 4,
    marginTop: 4,
    flex: 1,
    padding: 8,
    backgroundColor: "#1C1C1C",
    borderRadius: 8,
  },
  contentContainer: {
    flex: 1,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  imageMd: {
    height: 50,
    width: 50,
    borderRadius: 4,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontWeight: "600",
    color: "#fff",
  },
  secondaryText: {
    fontSize: 12,
    color: "#696969",
    marginTop: 1.5,
  },
  checkbox: {
    alignSelf: "center",
    marginRight: 24,
    height: 12,
    width: 12,
    borderRadius: 10,
  },
});
