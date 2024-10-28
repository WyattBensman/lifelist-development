import { User } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

export const getUserProfileById = async (_, { userId }, { user }) => {
  try {
    const foundUser = await User.findById(userId)
      .populate("collages", "_id coverImage")
      .populate("repostedCollages", "_id coverImage")
      .exec();

    if (!foundUser) {
      throw new Error("User not found.");
    }

    // Filter out collages and repostedCollages with archived set to true
    const filteredCollages = foundUser.collages.filter(
      (collage) => !collage.archived
    );
    const filteredRepostedCollages = foundUser.repostedCollages.filter(
      (collage) => !collage.archived
    );

    // Return user with filtered collages
    return {
      ...foundUser.toObject(), // Convert Mongoose Document to plain JavaScript object
      collages: filteredCollages,
      repostedCollages: filteredRepostedCollages,
    };
  } catch (error) {
    throw new Error("Database error: " + error.message);
  }
};

export const getFollowers = async (_, { userId }, { user }) => {
  isUser(user);
  const foundUser = await User.findById(userId)
    .populate({
      path: "followers",
      select: "_id username fullName profilePicture settings followRequests",
      populate: { path: "settings" },
    })
    .exec();
  if (!foundUser) throw new Error("User not found.");
  return foundUser.followers;
};

export const getFollowing = async (_, { userId }, { user }) => {
  isUser(user);
  const foundUser = await User.findById(userId)
    .populate({
      path: "following",
      select: "_id username fullName profilePicture settings followRequests",
      populate: { path: "settings" },
    })
    .exec();
  if (!foundUser) throw new Error("User not found.");
  return foundUser.following;
};

export const getUserCollages = async (_, { userId }) => {
  const foundUser = await User.findById(userId)
    .populate("collages", "_id coverImage archived")
    .exec();
  if (!foundUser) throw new Error("User not found for the provided ID.");
  return foundUser.collages;
};

export const getRepostedCollages = async (_, { userId }, { user }) => {
  isUser(user);
  const foundUser = await User.findById(userId)
    .populate("repostedCollages", "_id coverImage archived")
    .exec();
  if (!foundUser) throw new Error("User not found for the provided ID.");
  return foundUser.repostedCollages;
};

export const getTaggedCollages = async (_, { userId }, { user }) => {
  isUser(user);
  const foundUser = await User.findById(userId)
    .populate("taggedCollages", "_id coverImage archived")
    .exec();
  if (!foundUser) throw new Error("User not found for the provided ID.");
  return foundUser.taggedCollages;
};

export const getLikedCollages = async (_, __, { user }) => {
  isUser(user);
  const foundUser = await User.findById(user)
    .populate("likedCollages", "_id coverImage archived")
    .exec();
  if (!foundUser) throw new Error("User not found.");
  return foundUser.likedCollages;
};

export const getSavedCollages = async (_, __, { user }) => {
  isUser(user);
  const foundUser = await User.findById(user)
    .populate("savedCollages", "_id coverImage archived")
    .exec();
  if (!foundUser) throw new Error("User not found for the provided ID.");
  return foundUser.savedCollages;
};

export const getArchivedCollages = async (_, __, { user }) => {
  isUser(user);
  const foundUser = await User.findById(user)
    .populate("archivedCollages", "_id coverImage")
    .exec();
  if (!foundUser) throw new Error("User not found for the provided ID.");
  return foundUser.archivedCollages;
};

export const getBlockedUsers = async (_, __, { user }) => {
  isUser(user);
  const foundUser = await User.findById(user)
    .populate("blocked", "_id username fullName profilePicture")
    .exec();
  if (!foundUser) throw new Error("User not found for the provided ID.");
  return foundUser.blocked;
};

export const getUserProfileInformation = async (_, __, { user }) => {
  isUser(user);
  return User.findById(
    user,
    "profilePicture fullName username bio birthday gender"
  ).exec();
};

export const getUserContactInformation = async (_, __, { user }) => {
  isUser(user);
  return User.findById(user, "email phoneNumber").exec();
};

export const getUserIdentityInformation = async (_, __, { user }) => {
  isUser(user);
  return User.findById(user, "birthday gender").exec();
};

export const getUserSettingsInformation = async (_, __, { user }) => {
  isUser(user);
  const userData = await User.findById(user).exec();
  return userData.settings;
};

export const getAllUsers = async (_, { limit, offset }) => {
  try {
    const users = await User.find({})
      .skip(offset)
      .limit(limit)
      .select("_id fullName email phoneNumber username profilePicture")
      .exec();
    return users;
  } catch (error) {
    throw new Error("Failed to fetch users");
  }
};
