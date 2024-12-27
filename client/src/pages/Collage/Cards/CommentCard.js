import React, { useState } from "react";
import { Text, View, StyleSheet, Pressable } from "react-native";
import { Image } from "expo-image";
import { Swipeable } from "react-native-gesture-handler";
import { useMutation } from "@apollo/client";
import { LIKE_COMMENT, UNLIKE_COMMENT } from "../../../utils/mutations/index"; // Ensure correct import path
import { iconStyles, layoutStyles } from "../../../styles";
import { BASE_URL } from "../../../utils/config";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "../../../contexts/AuthContext"; // Ensure correct import path
import IconStatic from "../../../components/Icons/IconStatic";
import { useNavigation } from "@react-navigation/native"; // Import useNavigation

export default function CommentCard({
  comment,
  onDelete,
  onUpdate,
  onRequestClose,
  collageAuthorId,
}) {
  const navigation = useNavigation();
  const { currentUser } = useAuth();

  // Check if the current user has liked the comment
  const hasCurrentUserLiked = comment.likedBy.some(
    (user) => user._id === currentUser._id
  );

  const [isLiked, setIsLiked] = useState(hasCurrentUserLiked);
  const [likeCount, setLikeCount] = useState(comment.likes);

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

  const handleLikePress = () => {
    if (isLiked) {
      unlikeComment({ variables: { commentId: comment._id } });
    } else {
      likeComment({ variables: { commentId: comment._id } });
    }
  };

  const handleReportPress = () => {
    onRequestClose();
    navigation.navigate("Report", {
      entityId: comment._id, // Pass the comment ID
      entityType: "COMMENT", // Specify entity type as "COMMENT"
    });
  };

  const renderRightActions = () => {
    if (currentUser._id === comment.author._id) {
      // Comment author: Show delete button
      return (
        <Pressable
          style={styles.deleteButton}
          onPress={() => onDelete(comment._id)}
        >
          <IconStatic
            name="trash"
            tintColor={"#ececec"}
            style={iconStyles.trash}
            onPress={() => onDelete(comment._id)}
          />
        </Pressable>
      );
    } else if (currentUser._id === collageAuthorId) {
      // Collage author: Show delete and report buttons
      return (
        <View style={styles.actionsContainer}>
          <Pressable
            style={styles.deleteButton}
            onPress={() => onDelete(comment._id)}
          >
            <IconStatic
              name="trash"
              tintColor={"#ececec"}
              style={iconStyles.trash}
              onPress={() => onDelete(comment._id)}
            />
          </Pressable>
          <Pressable style={styles.reportButton} onPress={handleReportPress}>
            <IconStatic
              name="flag"
              tintColor={"#FF3B30"}
              style={iconStyles.trashSm}
              onPress={handleReportPress}
            />
          </Pressable>
        </View>
      );
    } else {
      // Neither: Show report button
      return (
        <Pressable style={styles.reportButton} onPress={handleReportPress}>
          <IconStatic
            name="flag"
            tintColor={"#fff"}
            style={iconStyles.trashSm}
            onPress={handleReportPress}
          />
        </Pressable>
      );
    }
  };

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <View style={layoutStyles.flex}>
        <View style={layoutStyles.flexRow}>
          <Image
            source={{ uri: `${BASE_URL}${comment.author.profilePicture}` }}
            style={[styles.image, styles.profilePicture]}
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
                  <Text style={{ color: "#696969", fontSize: 12 }}>
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
                    tintColor={isLiked ? "#ff0000" : "#696969"}
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
    backgroundColor: "#696969",
    marginLeft: 16,
  },
  actionsContainer: {
    flexDirection: "row",
  },
  reportButton: {
    backgroundColor: "#FF3B30", // grey background color
    justifyContent: "center",
    alignItems: "center",
    width: 85,
  },
  deleteButton: {
    backgroundColor: "#FF3B30",
    justifyContent: "center",
    alignItems: "center",
    width: 85,
  },
  image: {
    height: 40,
    width: 40,
    borderRadius: 4,
    marginRight: 6,
  },
  buttonText: {
    color: "#ffffff",
  },
  likeContainer: {
    marginHorizontal: 4,
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  likeCount: {
    color: "#696969",
    fontSize: 14,
  },
});
