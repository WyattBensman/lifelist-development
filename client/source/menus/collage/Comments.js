import React, { useState, useCallback, useEffect } from "react";
import {
  Text,
  View,
  TextInput,
  FlatList,
  Dimensions,
  Keyboard,
  Pressable,
} from "react-native";
import { useQuery, useMutation } from "@apollo/client";
import { useFocusEffect } from "@react-navigation/native";
import { GET_COMMENTS } from "../../../utils/queries";
import { CREATE_COMMENT, DELETE_COMMENT } from "../../../utils/mutations";
import BottomPopup from "./BottomPopup";
import CommentCard from "../../cards/collage/CommentCard";
import { menuStyles } from "../../../styles";
import { formStyles } from "../../../src/styles";

const { height: screenHeight } = Dimensions.get("window");

export default function Comments({
  visible,
  onRequestClose,
  collageId,
  collageAuthorId,
}) {
  const [comment, setComment] = useState("");
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const { data, refetch } = useQuery(GET_COMMENTS, {
    variables: { collageId },
    skip: !visible,
  });

  const [createComment] = useMutation(CREATE_COMMENT, {
    onCompleted: () => {
      setComment(""); // Clear input field after submission
      refetch(); // Refresh comments after adding a new one
    },
  });

  const [deleteComment] = useMutation(DELETE_COMMENT);

  useFocusEffect(
    useCallback(() => {
      if (visible) {
        refetch();
      }
    }, [visible, refetch])
  );

  const handleCommentChange = (text) => {
    setComment(text);
  };

  const handleCommentSubmit = async () => {
    if (comment.trim()) {
      try {
        await createComment({ variables: { collageId, text: comment } });
        Keyboard.dismiss(); // Dismiss the keyboard after submitting
      } catch (error) {
        console.error("Error submitting comment:", error.message);
      }
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment({ variables: { collageId, commentId } });
      refetch(); // Refresh comments after a comment is deleted
    } catch (error) {
      console.error("Error deleting comment:", error.message);
    }
  };

  const updateComment = (updatedComment) => {
    const updatedComments = data.getComments.map((comment) =>
      comment._id === updatedComment._id ? updatedComment : comment
    );
    refetch(); // Refresh comments after a comment is updated
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      (event) => {
        setKeyboardHeight(event.endCoordinates.height);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardHeight(0);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const isKeyboardActive = keyboardHeight > 0;

  return (
    <BottomPopup
      visible={visible}
      onRequestClose={onRequestClose}
      initialHeight={screenHeight * 0.6}
      draggableHeader={<Text style={menuStyles.draggableHeader}>Comments</Text>}
    >
      <View style={menuStyles.dynamicPopupContainer}>
        <FlatList
          data={data?.getComments || []}
          renderItem={({ item }) => (
            <View style={menuStyles.dynamicCardContainer}>
              <CommentCard
                comment={item}
                onDelete={handleDeleteComment}
                onUpdate={updateComment}
                collageAuthorId={collageAuthorId}
                onRequestClose={onRequestClose}
              />
            </View>
          )}
          keyExtractor={(item) => item._id}
          ListEmptyComponent={
            <Text style={menuStyles.emptyText}>No comments yet.</Text>
          }
        />
        <View
          style={[
            menuStyles.inputContainer,
            isKeyboardActive && { marginBottom: keyboardHeight },
          ]}
        >
          <TextInput
            style={formStyles.input}
            placeholder="Write a comment..."
            placeholderTextColor="#696969"
            value={comment}
            onChangeText={handleCommentChange}
            returnKeyType="send"
          />
          <Pressable
            style={menuStyles.postButton}
            onPress={handleCommentSubmit}
          >
            <Text style={menuStyles.postButtonText}>Post</Text>
          </Pressable>
        </View>
      </View>
    </BottomPopup>
  );
}
