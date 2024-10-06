import React, { useCallback, useEffect, useState } from "react";
import { FlatList, View, Text, ActivityIndicator } from "react-native";
import { useQuery, useMutation } from "@apollo/client";
import { useFocusEffect } from "@react-navigation/native";
import { layoutStyles } from "../../../../styles";
import ConversationCard from "../../Cards/ConversationCard";
import { GET_USER_CONVERSATIONS } from "../../../../utils/queries";
import { DELETE_CONVERSATION } from "../../../../utils/mutations/messagingMutations";
import { useAuth } from "../../../../contexts/AuthContext";

export default function Messages({ searchQuery }) {
  const { currentUser } = useAuth();
  const { data, loading, error, refetch } = useQuery(GET_USER_CONVERSATIONS);
  const [deleteConversation] = useMutation(DELETE_CONVERSATION);
  const [conversations, setConversations] = useState([]);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  useEffect(() => {
    if (data?.getUserConversations) {
      const sortedConversations = data.getUserConversations
        .filter(
          (conversation) =>
            conversation &&
            conversation.lastMessage &&
            conversation.lastMessage.sender
        )
        .sort(
          (a, b) =>
            new Date(b.lastMessage.sentAt) - new Date(a.lastMessage.sentAt)
        );
      setConversations(sortedConversations);
    }
  }, [data]);

  useEffect(() => {
    if (data?.getUserConversations) {
      const filteredConversations = data.getUserConversations.filter(
        (conversation) =>
          conversation &&
          conversation.participants.some(
            (participant) =>
              participant._id !== currentUser &&
              participant.fullName
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
          )
      );
      setConversations(filteredConversations);
    }
  }, [searchQuery, data]);

  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
  if (error) return <Text>Error: {error.message}</Text>;

  const handleDelete = async (conversationId) => {
    try {
      await deleteConversation({ variables: { conversationId } });
      setConversations((prevConversations) =>
        prevConversations.filter(
          (conversation) => conversation._id !== conversationId
        )
      );
    } catch (error) {
      console.error("Error deleting conversation:", error);
    }
  };

  const renderItem = ({ item }) => {
    if (!item) return null; // Skip null items

    const otherParticipant = item.participants.find(
      (participant) => participant._id !== currentUser
    );

    return (
      <ConversationCard
        conversationId={item._id}
        participantName={otherParticipant.fullName}
        participantProfilePicture={otherParticipant.profilePicture}
        message={item.lastMessage.content}
        createdAt={item.lastMessage.sentAt}
        onDelete={handleDelete}
      />
    );
  };

  return (
    <View style={layoutStyles.wrapper}>
      <FlatList
        data={conversations}
        renderItem={renderItem}
        keyExtractor={(item) =>
          item?._id.toString() || Math.random().toString()
        } // Handle null items
      />
    </View>
  );
}
