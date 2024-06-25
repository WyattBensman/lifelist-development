import React, { useState, useRef, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  ActivityIndicator,
} from "react-native";
import { useMutation, useQuery } from "@apollo/client";
import { iconStyles, layoutStyles } from "../../../styles";
import HeaderStack from "../../../components/Headers/HeaderStack";
import ChatInputBar from "../Components/ChatInputBar";
import Icon from "../../../components/Icons/Icon";
import { useNavigationContext } from "../../../contexts/NavigationContext";
import {
  CREATE_CONVERSATION,
  SEND_MESSAGE,
} from "../../../utils/mutations/messagingMutations";
import { GET_CONVERSATION } from "../../../utils/queries/inboxQueries";
import MessageBubble from "../Cards/MessageBubble";

export default function Conversation({ route, navigation }) {
  const { user, conversationId } = route.params;
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const { setIsTabBarVisible } = useNavigationContext();
  const { data, loading, error, refetch } = useQuery(GET_CONVERSATION, {
    variables: { conversationId },
    skip: !conversationId,
  });
  const [sendMessage] = useMutation(SEND_MESSAGE);
  const [createConversation] = useMutation(CREATE_CONVERSATION);
  const [messages, setMessages] = useState([]);
  const flatListRef = useRef(null);

  useFocusEffect(() => {
    setIsTabBarVisible(false);
    return () => setIsTabBarVisible(true);
  }, [setIsTabBarVisible]);

  useEffect(() => {
    if (data?.getConversation?.messages) {
      setMessages(data.getConversation.messages);
    }
  }, [data]);

  const handleSendMessage = async (messageContent) => {
    const newMessage = {
      _id: `temp-${Date.now()}`,
      content: messageContent,
      sentAt: new Date().toISOString(),
      sender: {
        _id: user._id,
        username: user.username,
        fullName: user.fullName,
        profilePicture: user.profilePicture,
      },
    };

    setMessages((prevMessages) => [newMessage, ...prevMessages]);

    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({ offset: 0, animated: true });
    }

    try {
      if (conversationId) {
        await sendMessage({
          variables: { conversationId, content: messageContent },
        });
        refetch();
      } else {
        const response = await createConversation({
          variables: { recipientId: user._id, message: messageContent },
        });
        if (response.data.createConversation.success) {
          refetch();
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prevMessages) =>
        prevMessages.filter((message) => message._id !== newMessage._id)
      );
    }
  };

  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <View style={layoutStyles.wrapper}>
      <HeaderStack
        arrow={
          <Icon
            name="chevron.backward"
            onPress={() => navigation.goBack()}
            style={iconStyles.backArrow}
            weight="semibold"
          />
        }
        title={user.fullName}
        button1={
          <Icon
            name="ellipsis"
            style={iconStyles.ellipsis}
            weight="bold"
            onPress={() => setDropdownVisible(!dropdownVisible)}
          />
        }
      />
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={({ item }) => (
          <MessageBubble
            key={item._id}
            message={item}
            isCurrentUser={item.sender._id === user._id}
          />
        )}
        keyExtractor={(item) => item._id}
        inverted
      />
      <ChatInputBar onSendMessage={handleSendMessage} />
    </View>
  );
}

const styles = StyleSheet.create({
  messageContainer: {
    marginVertical: 10,
  },
  messageText: {
    color: "#fff",
  },
});
