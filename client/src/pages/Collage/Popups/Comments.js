import React, { useState, useCallback, useEffect } from "react";
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Pressable,
  Dimensions,
  Keyboard,
} from "react-native";
import { useQuery, useMutation } from "@apollo/client";
import { useFocusEffect } from "@react-navigation/native";
import { GET_COMMENTS } from "../../../utils/queries";
import { CREATE_COMMENT, DELETE_COMMENT } from "../../../utils/mutations";
import { headerStyles, layoutStyles } from "../../../styles";
import BottomPopup from "./BottomPopup";
import CommentCard from "../Cards/CommentCard";

const { height: screenHeight } = Dimensions.get("window");

export default function Comments({
  visible,
  onRequestClose,
  collageId,
  collageAuthorId,
}) {
  const [comment, setComment] = useState("");
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const { data, loading, error, refetch } = useQuery(GET_COMMENTS, {
    variables: { collageId },
    skip: !visible,
  });

  useFocusEffect(
    useCallback(() => {
      if (visible) {
        refetch();
      }
    }, [visible, refetch])
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
      draggableHeader={
        <Text
          style={[
            headerStyles.headerMedium,
            { paddingHorizontal: 16, marginTop: 16 },
          ]}
        >
          Comments
        </Text>
      }
    >
      <View style={styles.popupContainer}>
        <View style={styles.separator} />
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : error ? (
          <Text>Error: {error.message}</Text>
        ) : (
          <FlatList
            data={data?.getComments || []}
            renderItem={({ item }) => (
              <View style={[layoutStyles.flex, styles.cardContainer]}>
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
              <Text style={styles.emptyText}>No comments yet.</Text>
            }
            contentContainerStyle={styles.flatListContent}
          />
        )}
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add a comment..."
          placeholderTextColor="#aaa"
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
    marginHorizontal: 16,
  },
  flatListContent: {
    flexGrow: 1,
  },
  popupContainer: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: "#696969",
    backgroundColor: "#1C1C1C",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#1c1c1c",
    fontSize: 14,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 9,
    backgroundColor: "#252525",
    color: "#ffffff",
    paddingHorizontal: 20,
  },
  postButton: {
    marginLeft: 8,
    paddingVertical: 9,
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
