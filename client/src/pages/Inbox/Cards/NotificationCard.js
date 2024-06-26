import React from "react";
import { Image, StyleSheet, Text, View, Pressable } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { layoutStyles, iconStyles } from "../../../styles";
import { BASE_URL } from "../../../utils/config";
import { truncateText, formatDate } from "../../../utils/utils";
import Icon from "../../../icons/Icon";

export default function NotificationCard({
  notificationId,
  senderName,
  senderProfilePicture,
  message,
  createdAt,
  onDelete,
}) {
  const truncatedMessage = truncateText(message, 32);

  const renderRightActions = () => (
    <Pressable
      style={styles.deleteButton}
      onPress={() => onDelete(notificationId)}
    >
      <Icon
        name="trash"
        tintColor={"#ececec"}
        style={iconStyles.trash}
        onPress={() => onDelete(notificationId)}
      />
    </Pressable>
  );

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <Image
            source={{ uri: `${BASE_URL}${senderProfilePicture}` }}
            style={styles.imageMd}
          />
          <View style={styles.textContainer}>
            <Text style={styles.primaryText}>{senderName}</Text>
            <Text style={styles.messageText}>{truncatedMessage}</Text>
          </View>
          <Text style={styles.date}>{formatDate(createdAt)}</Text>
        </View>
      </View>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    marginLeft: 8,
    paddingRight: 16,
    flex: 1,
    backgroundColor: "#121212",
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
    color: "#FFFFFF",
  },
  messageText: {
    fontSize: 12,
    color: "#d4d4d4",
    marginTop: 1.5,
  },
  date: {
    fontSize: 12,
    color: "#d4d4d4",
  },
  deleteButton: {
    backgroundColor: "#FF3B30",
    justifyContent: "center",
    alignItems: "center",
    width: 100,
    marginTop: 8,
  },
});
