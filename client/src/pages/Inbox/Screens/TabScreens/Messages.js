import React, { useCallback } from "react";
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useQuery } from "@apollo/client";
import { useFocusEffect } from "@react-navigation/native";
import { layoutStyles } from "../../../../styles";
import ConversationCard from "../../Cards/ConversationCard";
import { GET_USER_CONVERSATIONS } from "../../../../utils/queries";

export default function Messages() {
  const { data, loading, error, refetch } = useQuery(GET_USER_CONVERSATIONS);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
  if (error) return <Text>Error: {error.message}</Text>;

  const conversations = data.getUserConversations
    .filter((conversation) => conversation.lastMessage.sender !== null)
    .sort(
      (a, b) => new Date(b.lastMessage.sentAt) - new Date(a.lastMessage.sentAt)
    );

  const renderItem = ({ item }) => (
    <ConversationCard
      senderName={item.lastMessage.sender.fullName}
      senderProfilePicture={item.lastMessage.sender.profilePicture}
      message={item.lastMessage.content}
      createdAt={item.lastMessage.sentAt}
    />
  );

  return (
    <View style={layoutStyles.wrapper}>
      <FlatList
        data={conversations}
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
