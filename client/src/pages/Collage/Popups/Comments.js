import React, { useState } from "react";
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
import { GET_COMMENTS } from "../../../utils/queries"; // Ensure correct import path
import { CREATE_COMMENT, DELETE_COMMENT } from "../../../utils/mutations"; // Import the mutation
import { headerStyles, layoutStyles, popupStyles } from "../../../styles";
import BottomPopup from "../../Profile/Popups/BottomPopup";
import CommentCard from "../Cards/CommentCard";

export default function Comments({ visible, onRequestClose, collageId }) {
  const [comment, setComment] = useState("");
  const { data, loading, error, refetch } = useQuery(GET_COMMENTS, {
    variables: { collageId },
    skip: !visible, // Skip the query if the popup is not visible
  });

  const [createComment, { loading: mutationLoading }] = useMutation(
    CREATE_COMMENT,
    {
      onCompleted: () => {
        setComment(""); // Clear the input field after submission
        refetch(); // Refresh comments after a new comment is added
      },
    }
  );

  const [deleteComment] = useMutation(DELETE_COMMENT, {
    onCompleted: () => refetch(), // Refresh comments after a comment is deleted
  });

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
    } catch (error) {
      console.error("Error deleting comment:", error.message);
    }
  };

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <BottomPopup visible={visible} onRequestClose={onRequestClose} height={400}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.popupContainer}>
          <Text style={headerStyles.headerMedium}>Comments</Text>
          <FlatList
            data={data?.getComments || []}
            renderItem={({ item }) => (
              <View style={[popupStyles.cardContainer, layoutStyles.flex]}>
                <CommentCard comment={item} onDelete={handleDeleteComment} />
              </View>
            )}
            keyExtractor={(item) => item._id}
            ListEmptyComponent={<Text>No comments yet.</Text>}
            contentContainerStyle={styles.flatListContent}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Add a comment..."
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
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: "#ececec",
    backgroundColor: "#ffffff",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ececec",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#fbfbfe",
  },
  postButton: {
    marginLeft: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#6AB952",
    borderRadius: 20,
  },
  postButtonText: {
    color: "#ffffff",
    fontWeight: "500",
  },
});
