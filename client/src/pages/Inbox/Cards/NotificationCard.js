import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { layoutStyles } from "../../../styles";
import { truncateText } from "../../../utils/utils";
import { BASE_URL } from "../../../utils/config";
import { formatDate } from "../../../utils/utils";

export default function NotificationCard({
  senderName,
  senderProfilePicture,
  message,
  createdAt,
}) {
  const truncatedMessage = truncateText(message, 32);

  return (
    <View style={styles.container}>
      <View style={layoutStyles.flexRowSpace}>
        <View style={styles.row}>
          <Image
            source={{ uri: `${BASE_URL}${senderProfilePicture}` }}
            style={styles.image}
          />
          <View style={{ justifyContent: "center" }}>
            <Text style={styles.primaryText}>{senderName}</Text>
            <Text style={styles.secondaryText}>{truncatedMessage}</Text>
          </View>
        </View>
        <Text style={styles.date}>{formatDate(createdAt)}</Text>
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
  row: {
    flexDirection: "row",
  },
  image: {
    height: 50,
    width: 50,
    borderRadius: 4,
    marginRight: 6,
  },
});
