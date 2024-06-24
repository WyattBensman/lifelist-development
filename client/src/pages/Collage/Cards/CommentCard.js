import React from "react";
import { Image, Text, View, StyleSheet, Pressable } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { cardStyles, layoutStyles } from "../../../styles";
import { BASE_URL } from "../../../utils/config";
import { formatDistanceToNow } from "date-fns";
import Icon from "../../../icons/Icon"; // Ensure the correct import path

export default function CommentCard({ comment, onDelete }) {
  const renderRightActions = () => (
    <Pressable
      style={styles.deleteButton}
      onPress={() => onDelete(comment._id)}
    >
      <Icon name="trash" />
    </Pressable>
  );

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <View style={layoutStyles.flex}>
        <View style={layoutStyles.flexRow}>
          <Image
            source={{ uri: `${BASE_URL}${comment.author.profilePicture}` }}
            style={[cardStyles.imageSm, styles.profilePicture]}
          />
          <View style={[layoutStyles.wrapper, { backgroundColor: "#1c1c1c" }]}>
            <View style={layoutStyles.flexRow}>
              <Text
                style={[
                  layoutStyles.marginRightXs,
                  { fontWeight: "500", color: "#fff" },
                ]}
              >
                {comment.author.fullName}
              </Text>
              <Text style={{ color: "#d4d4d4", fontSize: 12 }}>
                {formatDistanceToNow(new Date(comment.createdAt))} ago
              </Text>
            </View>
            <Text style={{ color: "#ececec" }}>{comment.text}</Text>
          </View>
        </View>
      </View>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  commentContainer: {
    backgroundColor: "#fff",
  },
  profilePicture: {
    backgroundColor: "#d4d4d4",
  },
  deleteButton: {
    backgroundColor: "#FF3B30",
    justifyContent: "center",
    alignItems: "center",
    width: 80,
  },
});
