import { User, Conversation } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

/* MESSAGING QUERIES */
export const getUserConversations = async (_, __ /* { user } */) => {
  /* isUser(user); */

  // Find the authenticated user
  const currentUser = await User.findById("663a3129e0ffbeff092b81d4").populate(
    "conversations._id"
  );

  if (!currentUser) {
    throw new Error("User not found");
  }

  // Extract the conversation IDs
  const conversationIds = currentUser.conversations.map(
    (conversation) => conversation._id
  );

  // Find and populate the conversations
  const foundConversations = await Conversation.find({
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
    })
    .exec();

  return foundConversations;
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
  const userWithUnreadCount = await User.findById(user._id)
    .select("unreadMessagesCount")
    .exec();
  if (!userWithUnreadCount)
    throw new Error("User not found for the provided ID.");
  return userWithUnreadCount.unreadMessagesCount || 0;
};

/* NOTIFICATION QUERIES */
export const getUserNotifications = async (_, __, { user }) => {
  isUser(user);
  const foundUser = await User.findById(user._id)
    .populate({
      path: "notifications",
      populate: {
        path: "sender",
        model: "User",
        select: "_id username fullName profilePicture",
      },
    })
    .exec();
  if (!foundUser) throw new Error("User not found.");
  return foundUser.notifications || [];
};

export const getFollowRequests = async (_, __, { user }) => {
  isUser(user);
  const foundUser = await User.findById(user._id)
    .populate("followRequests", "_id username fullName profilePicture")
    .exec();
  if (!foundUser) throw new Error("User not found for the provided ID.");
  return foundUser.followRequests;
};
