import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { BASE_URL } from "../../../utils/config";

export default function MessageBubble({ message, isCurrentUser }) {
  return (
    <View
      style={[
        styles.messageContainer,
        isCurrentUser ? styles.currentUser : styles.otherUser,
      ]}
    >
      {!isCurrentUser && (
        <Image
          source={{ uri: `${BASE_URL}${message.sender.profilePicture}` }}
          style={styles.profilePicture}
        />
      )}
      <View
        style={[
          styles.bubble,
          isCurrentUser ? styles.currentUserBubble : styles.otherUserBubble,
        ]}
      >
        <Text
          style={[
            styles.messageText,
            isCurrentUser ? styles.currentUserText : styles.otherUserText,
          ]}
        >
          {message.content}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  messageContainer: {
    flexDirection: "row",
    marginVertical: 5,
    paddingHorizontal: 10,
    alignItems: "flex-end",
  },
  currentUser: {
    justifyContent: "flex-end",
  },
  otherUser: {
    justifyContent: "flex-start",
  },
  profilePicture: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  bubble: {
    borderRadius: 20,
    padding: 10,
    maxWidth: "70%",
  },
  currentUserBubble: {
    backgroundColor: "#6AB952",
    marginLeft: 50,
  },
  otherUserBubble: {
    backgroundColor: "#1C1C1C",
    marginRight: 50,
  },
  messageText: {
    color: "#fff",
  },
  currentUserText: {
    color: "#fff",
  },
  otherUserText: {
    color: "#fff",
  },
});
