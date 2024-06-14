import React, { useState } from "react";
import { Text, View, TextInput, StyleSheet, FlatList } from "react-native";
import { useQuery } from "@apollo/client";
import { GET_COMMENTS } from "../../../utils/queries"; // Ensure correct import path
import { headerStyles, layoutStyles, popupStyles } from "../../../styles";
import BottomPopup from "../../Profile/Popups/BottomPopup";
import CommentCard from "../Cards/CommentCard";

export default function Comments({ visible, onRequestClose, collageId }) {
  const [comment, setComment] = useState("");

  const { data, loading, error } = useQuery(GET_COMMENTS, {
    variables: { collageId },
    skip: !visible, // Skip the query if the popup is not visible
  });

  const handleCommentChange = (text) => {
    setComment(text);
  };

  const handleCommentSubmit = () => {
    // Add logic to handle comment submission
    console.log("Comment submitted:", comment);
    setComment(""); // Clear the input field after submission
  };

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <BottomPopup visible={visible} onRequestClose={onRequestClose} height={400}>
      <View style={styles.container}>
        <View style={styles.popupContainer}>
          <Text style={headerStyles.headerMedium}>Comments</Text>
          <FlatList
            data={data?.getComments || []}
            renderItem={({ item }) => (
              <View style={[popupStyles.cardContainer, layoutStyles.flex]}>
                <CommentCard comment={item} />
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
            onSubmitEditing={handleCommentSubmit}
          />
        </View>
      </View>
    </BottomPopup>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between", // Ensure content is spaced correctly
  },
  flatListContent: {
    flexGrow: 1,
  },
  popupContainer: {
    flex: 1,
    padding: 16, // Optional: adjust the padding as needed
  },
  inputContainer: {
    flexDirection: "row",
    flex: 0.2,
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: "#ececec",
    backgroundColor: "#ffffff", // Ensure background color matches the popup
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
});
