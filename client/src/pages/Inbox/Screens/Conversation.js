import React, { useState, useRef, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { View, FlatList, Text, ActivityIndicator } from "react-native";
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
import { useAuth } from "../../../contexts/AuthContext";

export default function Conversation({ route, navigation }) {
  const { currentUser } = useAuth();
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
  const [hasSentMessage, setHasSentMessage] = useState(false);

  useFocusEffect(() => {
    setIsTabBarVisible(false);
  });

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
        _id: currentUser,
        username: currentUser.username,
        fullName: currentUser.fullName,
        profilePicture: currentUser.profilePicture,
      },
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setHasSentMessage(true); // Mark that a message has been sent

    // Scroll to the bottom after sending a message
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
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
      setHasSentMessage(false); // Reset if message send fails
    }
  };

  const handleBackPress = () => {
    if (hasSentMessage) {
      navigation.navigate("Inbox");
    } else {
      navigation.goBack();
    }
  };

  const otherParticipant = data?.getConversation?.participants?.find(
    (participant) => participant._id !== currentUser
  );

  const displayUser = user || otherParticipant;

  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <View style={layoutStyles.wrapper}>
      <HeaderStack
        arrow={
          <Icon
            name="chevron.backward"
            onPress={handleBackPress}
            style={iconStyles.backArrow}
            weight="semibold"
          />
        }
        title={displayUser?.fullName || "Conversation"}
      />
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={({ item }) => (
          <MessageBubble
            key={item._id}
            message={item}
            isCurrentUser={item.sender._id === currentUser}
          />
        )}
        keyExtractor={(item) => item._id}
        onContentSizeChange={() =>
          flatListRef.current.scrollToEnd({ animated: true })
        }
        onLayout={() => flatListRef.current.scrollToEnd({ animated: true })}
      />
      <ChatInputBar onSendMessage={handleSendMessage} />
    </View>
  );
}
