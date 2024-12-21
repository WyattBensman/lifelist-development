import { User, Conversation } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

/* MESSAGING QUERIES */
/* export const getUserConversations = async (_, __, { user }) => {
  isUser(user);

  // Find the authenticated user
  const currentUser = await User.findById(user).populate(
    "conversations.conversation"
  );

  if (!currentUser) {
    throw new Error("User not found");
  }

  // Extract the conversation IDs
  const conversationIds = currentUser.conversations.map(
    (conv) => conv.conversation
  );

  // Find and populate the conversations
  const conversations = await Conversation.find({
    _id: { $in: conversationIds },
  })
    .populate({
      path: "lastMessage",
      populate: {
        path: "sender",
        model: "User",
        select: "_id username fullName profilePicture",
      },
    })
    .populate({
      path: "participants",
      model: "User",
      select: "_id username fullName profilePicture",
    });

  return conversations;
}; */

export const getUserConversations = async (_, __, { user }) => {
  try {
    // Find the authenticated user and populate the conversations
    const foundUser = await User.findById(user).populate({
      path: "conversations.conversation",
      populate: [
        {
          path: "participants",
          select: "_id username fullName profilePicture",
        },
        {
          path: "lastMessage",
          populate: {
            path: "sender",
            select: "_id username fullName profilePicture",
          },
        },
      ],
    });

    if (!foundUser) {
      throw new Error("User not found");
    }

    return foundUser.conversations.map((convo) => convo.conversation);
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching user conversations");
  }
};

export const getConversation = async (_, { conversationId }, { user }) => {
  isUser(user);
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
    })
    .exec();
  if (!conversation) throw new Error("Conversation not found.");
  return conversation;
};

export const getUnreadMessagesCount = async (_, __, { user }) => {
  isUser(user);
  const userWithUnreadCount = await User.findById(user)
    .select("unreadMessagesCount")
    .exec();
  if (!userWithUnreadCount)
    throw new Error("User not found for the provided ID.");
  return userWithUnreadCount.unreadMessagesCount || 0;
};

/* NOTIFICATION QUERIES */
export const getUserNotifications = async (_, __, { user }) => {
  isUser(user);

  // Fetch the user with notifications and follow requests
  const foundUser = await User.findById(user)
    .populate({
      path: "notifications",
      populate: {
        path: "sender",
        model: "User",
        select: "_id username fullName profilePicture",
      },
    })
    .select("notifications followRequests settings")
    .exec();

  if (!foundUser) throw new Error("User not found.");

  // Get the count of follow requests
  const followRequestsCount = foundUser.followRequests.length;

  // Check if the user is private
  const isProfilePrivate = foundUser.settings?.isProfilePrivate || false;

  return {
    notifications: foundUser.notifications || [],
    followRequestsCount,
    isProfilePrivate,
  };
};

export const getFollowRequests = async (_, __, { user }) => {
  isUser(user);
  const foundUser = await User.findById(user)
    .populate("followRequests", "_id username fullName profilePicture")
    .exec();
  if (!foundUser) throw new Error("User not found for the provided ID.");
  return foundUser.followRequests;
};
