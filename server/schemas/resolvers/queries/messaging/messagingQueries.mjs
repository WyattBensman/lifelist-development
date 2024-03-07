import { User, Conversation } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

export const getUserConversations = async (_, __, { user }) => {
  try {
    /* isUser(user); */
    const user = {
      _id: "65e72e4e82f12a087695250d",
      conversations: [
        {
          conversation: "65e8e27fef629d9763169403",
          isRead: true,
        },
      ],
    };

    // Get conversation IDs from the user's conversations field
    const conversationIds = user.conversations.map(
      (conversation) => conversation.conversation
    );

    // Find conversations based on the IDs
    const foundConversations = await Conversation.find({
      _id: { $in: conversationIds },
    }).populate({
      path: "lastMessage",
      model: "Message",
      populate: {
        path: "sender",
        model: "User",
      },
    });

    // Return only the found conversations
    return foundConversations;
  } catch (error) {
    throw new Error(`Error fetching user's conversations: ${error.message}`);
  }
};

export const getConversation = async (_, { conversationId }, { user }) => {
  try {
    /* isUser(user); */

    const conversation = await Conversation.findById(conversationId)
      .populate({
        path: "participants",
        select: "_id username fullName profilePicture",
      })
      .populate({
        path: "messages",
        populate: {
          path: "sender",
          select: "_id username fullName profilePicture",
        },
      });

    if (!conversation) {
      throw new Error("Conversation not found.");
    }

    return conversation;
  } catch (error) {
    throw new Error(
      `Error fetching messages for the conversation: ${error.message}`
    );
  }
};

export const getUnreadMessagesCount = async (_, __, { user }) => {
  try {
    isUser(user);

    const userWithUnreadCount = await User.findById(
      "65e72e4e82f12a087695250d"
    ).select("unreadMessagesCount");

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
