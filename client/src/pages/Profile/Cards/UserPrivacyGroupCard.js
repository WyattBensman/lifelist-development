import React, { useState } from "react";
import { Image, Text, View, StyleSheet, Pressable } from "react-native";
import CheckBox from "expo-checkbox";
import { BASE_URL } from "../../../utils/config";

export default function UserPrivacyGroupCard({
  isEditMode,
  fullName,
  username,
  profilePicture,
  isSelected,
  onSelect,
}) {
  const profilePictureUrl = `${BASE_URL}${profilePicture}`;

  return (
    <View style={styles.listItemContainer}>
      <Pressable onPress={onSelect} style={styles.contentContainer}>
        <Image source={{ uri: profilePictureUrl }} style={styles.imageMd} />
        <View style={styles.textContainer}>
          <Text style={styles.primaryText}>{fullName}</Text>
          <Text style={[styles.secondaryText, { marginTop: 2 }]}>
            @{username}
          </Text>
        </View>
        {isEditMode && (
          <CheckBox
            style={styles.checkbox}
            value={isSelected}
            onValueChange={onSelect}
            color={isSelected ? "#6AB952" : "#d4d4d4"}
          />
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  listItemContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    marginLeft: 8,
    marginRight: 16,
    flex: 1,
    borderRadius: 8,
  },
  contentContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    position: "relative",
  },
  imageMd: {
    height: 50,
    width: 50,
    borderRadius: 4,
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
  },
  primaryText: {
    fontWeight: "600",
    color: "#FFFFFF",
  },
  secondaryText: {
    fontSize: 12,
    color: "#d4d4d4",
    marginTop: 1.5,
  },
  checkbox: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 12,
    height: 12,
    borderWidth: 2,
    borderRadius: 10,
  },
});
