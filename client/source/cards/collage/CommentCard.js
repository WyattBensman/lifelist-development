import React, { useState } from "react";
import { Text, View, Pressable } from "react-native";
import { Image } from "expo-image";
import { Swipeable } from "react-native-gesture-handler";
import { useMutation } from "@apollo/client";
import { LIKE_COMMENT, UNLIKE_COMMENT } from "../../../utils/mutations";
import { cardStyles, iconStyles } from "../../../styles";
import { BASE_URL } from "../../../utils/config";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "../../../contexts/AuthContext";
import Icon from "../../icons/Icon";
import { useNavigation } from "@react-navigation/native";

export default function CommentCard({
  comment,
  onDelete,
  onUpdate,
  onRequestClose,
  collageAuthorId,
}) {
  const navigation = useNavigation();
  const { currentUser } = useAuth();

  const [isLiked, setIsLiked] = useState(
    comment.likedBy.some((user) => user._id === currentUser._id)
  );
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
    onRequestClose?.();
    navigation.navigate("Report", {
      entityId: comment._id,
      entityType: "COMMENT",
    });
  };

  const renderRightActions = () => {
    if (currentUser._id === comment.author._id) {
      return (
        <Pressable
          style={cardStyles.deleteAction}
          onPress={() => onDelete(comment._id)}
        >
          <Icon name="trash" style={iconStyles.trash} tintColor="#fff" />
        </Pressable>
      );
    } else if (currentUser._id === collageAuthorId) {
      return (
        <View style={cardStyles.actionsContainer}>
          <Pressable
            style={cardStyles.deleteAction}
            onPress={() => onDelete(comment._id)}
          >
            <Icon name="trash" style={iconStyles.trash} tintColor="#fff" />
          </Pressable>
          <Pressable
            style={cardStyles.reportAction}
            onPress={handleReportPress}
          >
            <Icon name="flag" style={iconStyles.flag} tintColor="#FF3B30" />
          </Pressable>
        </View>
      );
    } else {
      return (
        <Pressable style={cardStyles.reportAction} onPress={handleReportPress}>
          <Icon name="flag" style={iconStyles.flag} tintColor="#fff" />
        </Pressable>
      );
    }
  };

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <View style={cardStyles.commentCardContainer}>
        <Image
          source={{
            uri: `${BASE_URL}${comment.author.profilePicture}`,
          }}
          style={cardStyles.commentImage}
        />
        <View style={cardStyles.commentContent}>
          <View style={cardStyles.commentHeader}>
            <Text style={cardStyles.primaryText}>
              {comment.author.fullName}
            </Text>
            <Text style={cardStyles.secondaryText}>
              {formatDistanceToNow(new Date(comment.createdAt))} ago
            </Text>
          </View>
          <Text style={cardStyles.commentText}>{comment.text}</Text>
          <View style={cardStyles.likeContainer}>
            <Pressable onPress={handleLikePress}>
              <Icon
                name={isLiked ? "heart.fill" : "heart"}
                style={iconStyles.like}
                tintColor={isLiked ? "#FF0000" : "#696969"}
              />
            </Pressable>
            <Text style={cardStyles.likeCount}>{likeCount}</Text>
          </View>
        </View>
      </View>
    </Swipeable>
  );
}
