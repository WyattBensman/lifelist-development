import React from "react";
import { Image, Text, View, StyleSheet } from "react-native";
import { cardStyles, layoutStyles } from "../../../styles";
import ButtonSmall from "../../../components/Buttons/ButtonSmall";

export default function FriendRequestCard({
  fullName,
  profilePicture,
  username,
}) {
  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Image source={{ uri: profilePicture }} style={styles.image} />
        <Pressable style={styles.textContainer} onPress={handleProfilePress}>
          <Text style={styles.primaryText}>{user.fullName}</Text>
          <Text style={[styles.secondaryText, { marginTop: 2 }]}>
            @{user.username}
          </Text>
        </Pressable>
      </View>
      <View style={styles.flexRow}>
        <ButtonSmall
          text={"Accept"}
          textColor={"#6AB952"}
          backgroundColor={"#252525"}
          onPress={toggleModal}
        />
        <ButtonSmall
          text={"Decline"}
          textColor={"#d4d4d4"}
          backgroundColor={"#252525"}
          onPress={toggleModal}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
  },
  image: {
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
  flexRow: {
    flexDirection: "row",
  },
});
