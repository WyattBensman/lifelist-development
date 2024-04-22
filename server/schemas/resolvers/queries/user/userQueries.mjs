import { User, LogbookItem } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

export const getUserProfileById = async (_, { userId }) => {
  const foundUser = await User.findById(userId)
    .populate("collages", "_id images")
    .exec();
  if (!foundUser) throw new Error("User not found.");
  return foundUser;
};

export const searchUsers = async (_, { query }) => {
  return User.find(
    {
      $or: [
        { username: { $regex: query, $options: "i" } },
        { fullName: { $regex: query, $options: "i" } },
      ],
    },
    "username fullName profilePicture"
  ).exec();
};

export const getFollowers = async (_, { userId }, { user }) => {
  isUser(user);
  const foundUser = await User.findById(userId)
    .populate("followers", "_id username fullName profilePicture")
    .exec();
  if (!foundUser) throw new Error("User not found.");
  return foundUser.followers;
};

export const getFollowing = async (_, { userId }, { user }) => {
  isUser(user);
  const foundUser = await User.findById(userId)
    .populate("following", "_id username fullName profilePicture")
    .exec();
  if (!foundUser) throw new Error("User not found.");
  return foundUser.following;
};

export const getUserCollages = async (_, { userId }) => {
  const foundUser = await User.findById(userId)
    .populate("collages", "_id coverImage")
    .exec();
  if (!foundUser) throw new Error("User not found for the provided ID.");
  return foundUser.collages;
};

export const getUserRepostedCollages = async (_, { userId }, { user }) => {
  isUser(user);
  const foundUser = await User.findById(userId)
    .populate("repostedCollages", "_id coverImage")
    .exec();
  if (!foundUser) throw new Error("User not found for the provided ID.");
  return foundUser.repostedCollages;
};

export const getUserTaggedCollages = async (_, { userId }, { user }) => {
  isUser(user);
  const foundUser = await User.findById(userId)
    .populate("taggedCollages", "_id coverImage")
    .exec();
  if (!foundUser) throw new Error("User not found for the provided ID.");
  return foundUser.taggedCollages;
};

export const getUserSavedCollages = async (_, __, { user }) => {
  isUser(user);
  const foundUser = await User.findById(user._id)
    .populate("savedCollages", "_id coverImage")
    .exec();
  if (!foundUser) throw new Error("User not found for the provided ID.");
  return foundUser.savedCollages;
};

export const getUserArchives = async (_, __, { user }) => {
  isUser(user);
  const foundUser = await User.findById(user._id)
    .populate("archivedCollages", "_id coverImage")
    .exec();
  if (!foundUser) throw new Error("User not found for the provided ID.");
  return foundUser.archivedCollages;
};

export const getUserLogbook = async (_, __, { user }) => {
  isUser(user);
  return LogbookItem.find({ user: user._id }).exec();
};

export const getBlockedUsers = async (_, __, { user }) => {
  isUser(user);
  const foundUser = await User.findById(user._id)
    .populate("blocked", "_id username fullName profilePicture")
    .exec();
  if (!foundUser) throw new Error("User not found for the provided ID.");
  return foundUser.blocked;
};

export const getFlowpageLinks = async (_, { userId }, { user }) => {
  isUser(user);
  const foundUser = await User.findById(userId, "flowpageLinks").exec();
  if (!foundUser) throw new Error("User not found for the provided ID.");
  return foundUser.flowpageLinks;
};

export const getUserProfileInformation = async (_, __, { user }) => {
  isUser(user);
  return User.findById(user._id, "profilePicture fullName username bio").exec();
};

export const getUserContactInformation = async (_, __, { user }) => {
  isUser(user);
  return User.findById(user._id, "email phoneNumber").exec();
};

export const getUserIdentityInformation = async (_, __, { user }) => {
  isUser(user);
  return User.findById(user._id, "birthday gender").exec();
};

export const getUserSettingsInformation = async (_, __, { user }) => {
  isUser(user);
  return User.findById(user._id, "settings").exec();
};
