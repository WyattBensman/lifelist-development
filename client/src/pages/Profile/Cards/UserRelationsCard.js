import React from "react";
import { Image, Text, View, StyleSheet } from "react-native";
import ButtonSmall from "../../../components/Buttons/ButtonSmall";
import { BASE_URL } from "../../../utils/config";

export default function UserRelationsCard({ user, action }) {
  const profilePictureUrl = `${BASE_URL}${user.profilePicture}`;

  return (
    <View style={styles.listItemContainer}>
      <View style={styles.contentContainer}>
        <Image source={{ uri: profilePictureUrl }} style={styles.imageMd} />
        <View style={styles.textContainer}>
          <Text style={styles.primaryText}>{user.fullName}</Text>
          <Text style={[styles.secondaryText, { marginTop: 2 }]}>
            @{user.username}
          </Text>
        </View>
        <View style={styles.actionButtonContainer}>
          <ButtonSmall text={action} backgroundColor={"#ececec"} />
        </View>
      </View>
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
    marginTop: 4,
  },
  secondaryText: {
    fontSize: 12,
    color: "#8A8A8E",
    marginTop: 1.5,
  },
  actionButtonContainer: {
    borderRadius: 8,
    alignSelf: "center",
  },
});
