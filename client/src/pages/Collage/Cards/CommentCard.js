import React from "react";
import { Image, Text, View, StyleSheet } from "react-native";
import { cardStyles, layoutStyles } from "../../../styles";
import { BASE_URL } from "../../../utils/config";
import { formatDistanceToNow } from "date-fns";

export default function CommentCard({ comment }) {
  return (
    <View style={layoutStyles.flex}>
      <View style={layoutStyles.flexRow}>
        <Image
          source={{ uri: `${BASE_URL}${comment.author.profilePicture}` }}
          style={[cardStyles.imageSm, styles.profilePicture]}
        />
        <View style={layoutStyles.wrapper}>
          <View style={layoutStyles.flexRow}>
            <Text style={[layoutStyles.marginRightXs, { fontWeight: "500" }]}>
              {comment.author.fullName}
            </Text>
            <Text style={{ color: "#d4d4d4", fontSize: 12 }}>
              {formatDistanceToNow(new Date(comment.createdAt))} ago
            </Text>
          </View>
          <Text>{comment.text}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  profilePicture: {
    backgroundColor: "#d4d4d4",
  },
});
