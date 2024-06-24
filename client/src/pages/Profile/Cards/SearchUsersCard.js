import React, { useState, useEffect } from "react";
import { Image, Text, View, Pressable, StyleSheet } from "react-native";
import { cardStyles } from "../../../styles";
import { BASE_URL } from "../../../utils/config";
import CheckBox from "expo-checkbox";

export default function SearchUsersCard({ user, isSelected, onSelect }) {
  const [isChecked, setIsChecked] = useState(isSelected);
  const profilePictureUrl = `${BASE_URL}${user.profilePicture}`;

  useEffect(() => {
    setIsChecked(isSelected);
  }, [isSelected]);

  const handlePress = () => {
    setIsChecked(!isChecked);
    onSelect(user, !isChecked);
  };

  return (
    <View style={[styles.listItemContainer]}>
      <Pressable onPress={handlePress} style={styles.pressable}>
        <View style={styles.contentContainer}>
          <Image
            source={{ uri: profilePictureUrl }}
            style={cardStyles.imageMd}
          />
          <View style={styles.textContainer}>
            <Text style={styles.title}>{user.fullName}</Text>
            <Text style={styles.secondaryText}>@{user.username}</Text>
          </View>
          <CheckBox
            value={isChecked}
            onValueChange={handlePress}
            style={styles.checkbox}
            color={isChecked ? "#6AB952" : "#d4d4d4"}
          />
        </View>
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
  pressable: {
    flex: 1,
    width: "100%",
  },
  contentContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
