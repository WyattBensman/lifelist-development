import { User } from "../../../../models/index.mjs";

export const getUserConversations = async (_, __, { user }) => {
  // Check if the user is authenticated
  isUser(user);

  try {
    const userWithConversations = await User.findById(user.id).populate({
      path: "conversations",
      populate: [
        {
          path: "participants.user",
          select: "username fullName profilePicture",
        },
        { path: "lastMessage", select: "text createdAt" },
      ],
    });

    if (!userWithConversations) {
      throw new Error("User not found for the provided ID.");
    }

    return userWithConversations.conversations;
  } catch (error) {
    throw new Error(`Error fetching user's conversations: ${error.message}`);
  }
};

export const getConversationMessages = async (_, { conversationId }) => {
  try {
    const conversation = await Conversation.findById(conversationId).populate({
      path: "messages",
      populate: { path: "sender", select: "username fullName profilePicture" },
    });

    if (!conversation) {
      throw new Error("Conversation not found.");
    }

    return conversation.messages;
  } catch (error) {
    throw new Error(
      `Error fetching messages for the conversation: ${error.message}`
    );
  }
};

export const getUnreadMessagesCount = async (_, __, { user }) => {
  // Check if the user is authenticated
  isUser(user);

  try {
    const userWithUnreadCount = await User.findById(user.id).select(
      "unreadMessagesCount"
    );

    if (!userWithUnreadCount) {
      throw new Error("User not found for the provided ID.");
    }

    return userWithUnreadCount.unreadMessagesCount || 0;
  } catch (error) {
    throw new Error(
      `Error fetching user's unread messages count: ${error.message}`
    );
  }
};
