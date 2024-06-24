import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { truncateText } from "../../../utils/utils";
import { cardStyles, layoutStyles } from "../../../styles";

export default function ConversationCard({
  senderName,
  senderProfilePicture,
  message,
  createdAt,
}) {
  const truncatedMessage = truncateText(message, 25);

  return (
    <View style={styles.container}>
      <View style={layoutStyles.flexRowSpace}>
        <View style={styles.row}>
          <Image source={{ uri: senderProfilePicture }} style={styles.image} />
          <View style={{ justifyContent: "center" }}>
            <Text style={styles.primaryText}>{senderName}</Text>
            <Text style={styles.messageText}>{truncatedMessage}</Text>
          </View>
        </View>
        <Text style={styles.date}>
          {new Date(createdAt).toLocaleTimeString()}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    marginLeft: 8,
    marginRight: 8,
  },
  row: {
    flexDirection: "row",
  },
  primaryText: {
    fontWeight: "500",
    color: "#fff",
  },
  secondaryText: {
    fontSize: 12,
    color: "#ececec",
  },
  date: {
    fontSize: 12,
    color: "#d4d4d4",
  },
  image: {
    height: 50,
    width: 50,
    borderRadius: 4,
    marginRight: 6,
  },
});
