import React, { useState, useEffect } from "react";
import { Image, Text, View, Pressable, StyleSheet } from "react-native";
import Checkbox from "expo-checkbox";
import { BASE_URL } from "../../../utils/config";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../../contexts/AuthContext";

export default function SearchUserCard({ user, isSelected, onCheckboxToggle }) {
  const { currentUser } = useAuth();
  const profilePictureUrl = `${BASE_URL}${user.profilePicture}`;
  const navigation = useNavigation();

  const [isChecked, setIsChecked] = useState(isSelected);

  useEffect(() => {
    setIsChecked(isSelected);
  }, [isSelected]);

  const handlePress = () => {
    setIsChecked(!isChecked);
    onCheckboxToggle(user, !isChecked);
  };

  return (
    <View style={styles.listItemContainer}>
      <Pressable onPress={handlePress} style={styles.pressable}>
        <View style={styles.contentContainer}>
          <Image source={{ uri: profilePictureUrl }} style={styles.imageMd} />
          <View style={styles.textContainer}>
            <Text style={styles.primaryText}>{user.fullName}</Text>
            <Text style={styles.secondaryText}>@{user.username}</Text>
          </View>
          {currentUser._id !== user._id && (
            <Checkbox
              value={isChecked}
              onValueChange={handlePress}
              style={styles.checkbox}
              color={isChecked ? "#6AB952" : "#d4d4d4"}
            />
          )}
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
  imageMd: {
    width: 50,
    height: 50,
    borderRadius: 4,
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
  },
  primaryText: {
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
