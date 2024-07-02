import React, { useState, useCallback } from "react";
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useQuery, useMutation } from "@apollo/client";
import { useFocusEffect } from "@react-navigation/native";
import { GET_COMMENTS } from "../../../utils/queries"; // Ensure correct import path
import { CREATE_COMMENT, DELETE_COMMENT } from "../../../utils/mutations"; // Ensure the mutation
import { headerStyles, layoutStyles, popupStyles } from "../../../styles";
import BottomPopup from "../../Profile/Popups/BottomPopup";
import CommentCard from "../Cards/CommentCard";

export default function Comments({ visible, onRequestClose, collageId }) {
  const [comment, setComment] = useState("");
  const { data, loading, error, refetch } = useQuery(GET_COMMENTS, {
    variables: { collageId },
    skip: !visible, // Skip the query if the popup is not visible
  });

  useFocusEffect(
    useCallback(() => {
      if (visible) {
        refetch();
      }
    }, [visible])
  );

  const [createComment, { loading: mutationLoading }] = useMutation(
    CREATE_COMMENT,
    {
      onCompleted: () => {
        setComment(""); // Clear the input field after submission
        refetch(); // Refresh comments after a new comment is added
      },
    }
  );

  const [deleteComment] = useMutation(DELETE_COMMENT);

  const handleCommentChange = (text) => {
    setComment(text);
  };

  const handleCommentSubmit = async () => {
    if (comment.trim()) {
      try {
        await createComment({ variables: { collageId, text: comment } });
      } catch (error) {
        console.error("Error submitting comment:", error.message);
      }
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment({ variables: { collageId, commentId } });
      // Manually remove the comment from the local state
      refetch();
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

  return (
    <BottomPopup visible={visible} onRequestClose={onRequestClose} height={400}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.popupContainer}>
          <Text style={headerStyles.headerMedium}>Comments</Text>
          <View style={styles.separator} />
          <FlatList
            data={data?.getComments || []}
            renderItem={({ item }) => (
              <View style={[layoutStyles.flex, styles.cardContainer]}>
                <CommentCard
                  comment={item}
                  onDelete={handleDeleteComment}
                  onUpdate={updateComment}
                />
              </View>
            )}
            keyExtractor={(item) => item._id}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No comments yet.</Text>
            }
            contentContainerStyle={styles.flatListContent}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Add a comment..."
            placeholderTextColor="#a1a1a1"
            value={comment}
            onChangeText={handleCommentChange}
            editable={!mutationLoading} // Disable input during mutation
          />
          {mutationLoading ? (
            <ActivityIndicator size="small" color="#0000ff" />
          ) : (
            <Pressable style={styles.postButton} onPress={handleCommentSubmit}>
              <Text style={styles.postButtonText}>Post</Text>
            </Pressable>
          )}
        </View>
      </KeyboardAvoidingView>
    </BottomPopup>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  cardContainer: {
    paddingBottom: 12,
  },
  separator: {
    height: 2,
    backgroundColor: "#252525",
    marginBottom: 8,
  },
  flatListContent: {
    flexGrow: 1,
  },
  popupContainer: {
    flex: 1,
    padding: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: "#696969",
    backgroundColor: "#1C1C1C",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#1c1c1c",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#252525",
    color: "#ffffff",
  },
  postButton: {
    marginLeft: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#6AB95230",
    borderRadius: 20,
  },
  postButtonText: {
    color: "#6AB952",
    fontWeight: "600",
  },
  emptyText: {
    color: "#696969",
    textAlign: "center",
    marginTop: 20,
  },
});
