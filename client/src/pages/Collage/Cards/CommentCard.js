import React, { useState } from "react";
import { Image, Text, View, StyleSheet, Pressable } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { useMutation } from "@apollo/client";
import { LIKE_COMMENT, UNLIKE_COMMENT } from "../../../utils/mutations/index";
import { cardStyles, iconStyles, layoutStyles } from "../../../styles";
import { BASE_URL } from "../../../utils/config";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "../../../contexts/AuthContext";
import IconStatic from "../../../components/Icons/IconStatic";

export default function CommentCard({ comment, onDelete, onUpdate }) {
  const { currentUser } = useAuth();
  const [isLiked, setIsLiked] = useState(
    comment.likedBy.includes(currentUser._id)
  );
  const [likeCount, setLikeCount] = useState(comment.likes);
  console.log(comment._id);

  const [likeComment] = useMutation(LIKE_COMMENT, {
    onCompleted: (data) => {
      setIsLiked(true);
      setLikeCount((prevCount) => prevCount + 1);
      onUpdate(data.likeComment);
    },
  });

  const [unlikeComment] = useMutation(UNLIKE_COMMENT, {
    onCompleted: (data) => {
      setIsLiked(false);
      setLikeCount((prevCount) => prevCount - 1);
      onUpdate(data.unlikeComment);
    },
  });

  const handleLikePress = async () => {
    try {
      if (isLiked) {
        await unlikeComment({ variables: { commentId: comment._id } });
      } else {
        await likeComment({ variables: { commentId: comment._id } });
      }
    } catch (error) {
      console.error("Error handling like/unlike:", error.message);
    }
  };

  const renderRightActions = () => (
    <Pressable
      style={styles.deleteButton}
      onPress={() => onDelete(comment._id)}
    >
      <IconStatic name="trash" tintColor={"#ececec"} style={iconStyles.trash} />
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
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <View>
                <View style={layoutStyles.flexRow}>
                  <Text
                    style={[
                      layoutStyles.marginRightXs,
                      { fontWeight: "500", color: "#fff" },
                    ]}
                  >
                    {comment.author.fullName}
                  </Text>
                  <Text style={{ color: "#A1A1A1", fontSize: 12 }}>
                    {formatDistanceToNow(new Date(comment.createdAt))} ago
                  </Text>
                </View>
                <Text style={{ color: "#fff" }}>{comment.text}</Text>
              </View>
              <View style={styles.likeContainer}>
                <Pressable onPress={handleLikePress}>
                  <IconStatic
                    name={isLiked ? "heart.fill" : "heart"}
                    style={iconStyles.likeComment}
                    weight={"medium"}
                    tintColor={isLiked ? "#ff0000" : "#A1A1A1"}
                    onPress={handleLikePress}
                  />
                </Pressable>
                <Text style={styles.likeCount}>{likeCount}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  profilePicture: {
    backgroundColor: "#d4d4d4",
  },
  deleteButton: {
    backgroundColor: "#FF3B30",
    justifyContent: "center",
    alignItems: "center",
    width: 100,
  },
  likeContainer: {
    marginHorizontal: 4,
    flexDirection: "row",
    alignItems: "center",
  },
  likeCount: {
    color: "#A1A1A1",
    fontSize: 12,
  },
});
