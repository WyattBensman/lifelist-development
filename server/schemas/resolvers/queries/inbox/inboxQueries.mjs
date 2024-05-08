import { User, Conversation } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

/* MESSAGING QUERIES */
export const getUserConversations = async (_, __, { user }) => {
  isUser(user);
  const conversationIds = user.conversations.map(
    (conversation) => conversation.conversation
  );
  const foundConversations = await Conversation.find({
    _id: { $in: conversationIds },
  })
    .populate({
      path: "lastMessage",
      populate: {
        path: "sender",
        model: "User",
        select: "username fullName profilePicture",
      },
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
        select: "username fullName profilePicture",
      },
    })
    .exec();
  if (!foundUser) throw new Error("User not found.");
  return foundUser.notifications || [];
};

export const getUserFollowRequest = async (_, __, { user }) => {
  isUser(user);
  const foundUser = await User.findById(user._id)
    .populate({
      path: "followRequests.userId",
      select: "username fullName profilePicture",
    })
    .exec();
  if (!foundUser) throw new Error("User not found for the provided ID.");
  return foundUser.followRequests;
};