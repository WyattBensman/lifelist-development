import React from "react";
import { Image, Text, View, StyleSheet } from "react-native";
import ForwardArrowIcon from "../../../icons/Universal/ForwardArrowIcon";
import { BASE_URL } from "../../../utils/config";

export default function ParticipantCard({ participant }) {
  const profilePictureUrl = `${BASE_URL}${participant.profilePicture}`;

  return (
    <View style={styles.listItemContainer}>
      <View style={styles.contentContainer}>
        <Image source={{ uri: profilePictureUrl }} style={styles.imageMd} />
        <View style={styles.textContainer}>
          <Text style={styles.primaryText}>{participant.fullName}</Text>
          <Text style={[styles.secondaryText, { marginTop: 2 }]}>
            @{participant.username}
          </Text>
        </View>
        <View style={styles.iconContainer}>
          <ForwardArrowIcon />
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
    flex: 1,
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
    justifyContent: "center",
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
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
});
