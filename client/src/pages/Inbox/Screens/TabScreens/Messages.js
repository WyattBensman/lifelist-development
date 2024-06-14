import React from "react";
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useQuery } from "@apollo/client";
import { layoutStyles } from "../../../../styles";
import ConversationCard from "../../Cards/ConversationCard";
import { GET_USER_CONVERSATIONS } from "../../../../utils/queries";

export default function Messages() {
  const { data, loading, error } = useQuery(GET_USER_CONVERSATIONS);

  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
  if (error) return <Text>Error: {error.message}</Text>;

  const renderItem = ({ item }) => {
    if (!item.lastMessage.sender) {
      return null; // Skip rendering this conversation if the last message sender is null
    }

    return (
      <ConversationCard
        senderName={item.lastMessage.sender.fullName}
        senderProfilePicture={item.lastMessage.sender.profilePicture}
        message={item.lastMessage.content}
        createdAt={item.lastMessage.sentAt}
      />
    );
  };

  return (
    <View style={layoutStyles.wrapper}>
      <FlatList
        data={data.getUserConversations.filter(
          (conversation) => conversation.lastMessage.sender !== null
        )}
        renderItem={renderItem}
        keyExtractor={(item) => item._id.toString()}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    padding: 8,
  },
});
