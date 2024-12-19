import React from "react";
import { Image, Text, View, StyleSheet, Pressable } from "react-native";

export default function RecommendedProfileCard({ user, navigation }) {
  const handleProfilePress = () => {
    navigation.navigate("ProfileStack", {
      screen: "Profile",
      params: { userId: user._id },
    });
  };

  return (
    <Pressable style={styles.cardContainer} onPress={handleProfilePress}>
      <Image source={{ uri: user.profilePicture }} style={styles.imageMd} />
      <View style={styles.textContainer}>
        <Text style={styles.primaryText}>{user.fullName}</Text>
        <Text style={styles.secondaryText}>@{user.username}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: "#1C1C1C",
    borderRadius: 8,
    paddingLeft: 10,
    paddingVertical: 10,
    paddingRight: 20,
    marginRight: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  imageMd: {
    height: 40,
    width: 40,
    borderRadius: 4,
  },
  textContainer: {
    marginLeft: 8,
  },
  primaryText: {
    fontWeight: "600",
    color: "#FFFFFF",
  },
  secondaryText: {
    fontSize: 12,
    color: "#d4d4d4",
    marginTop: 2,
  },
});
