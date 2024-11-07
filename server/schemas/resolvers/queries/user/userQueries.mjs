import { User } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

export const getUserProfileById = async (_, { userId }, { user }) => {
  try {
    const foundUser = await User.findById(userId)
      .populate({
        path: "collages",
        match: { archived: false },
        select: "_id coverImage",
      })
      .populate({
        path: "repostedCollages",
        match: { archived: false },
        select: "_id coverImage",
      })
      .select("_id fullName username bio profilePicture")
      .exec();

    if (!foundUser) {
      throw new Error("User not found.");
    }

    // Count non-archived collages
    const collagesCount = foundUser.collages.length;

    return {
      ...foundUser.toObject(),
      collagesCount,
    };
  } catch (error) {
    throw new Error("Database error: " + error.message);
  }
};

export const getUserCounts = async (_, { userId }, { user }) => {
  try {
    isUser(user);
    const followersCount = await User.countDocuments({ following: userId });
    const followingCount = await User.countDocuments({ followers: userId });

    return {
      followersCount,
      followingCount,
    };
  } catch (error) {
    throw new Error("Database error: " + error.message);
  }
};

export const getFollowers = async (
  _,
  { userId, cursor, limit = 20 },
  { user }
) => {
  isUser(user);

  const foundUser = await User.findById(userId)
    .populate({
      path: "followers",
      match: cursor ? { _id: { $gt: cursor } } : {}, // Only fetch followers after the cursor
      options: {
        sort: { _id: 1 }, // Sort by _id to support cursor-based pagination
        limit: limit + 1, // Fetch one extra item to check if there's a next page
      },
      select: "_id username fullName profilePicture settings followRequests",
      populate: { path: "settings" },
    })
    .exec();

  if (!foundUser) throw new Error("User not found.");

  const followers = foundUser.followers;

  // Check if there is a next page
  const hasNextPage = followers.length > limit;
  if (hasNextPage) followers.pop(); // Remove the extra item

  return {
    followers,
    nextCursor: hasNextPage ? followers[followers.length - 1]._id : null,
    hasNextPage,
  };
};

export const getFollowing = async (
  _,
  { userId, cursor, limit = 20 },
  { user }
) => {
  isUser(user);

  const foundUser = await User.findById(userId)
    .populate({
      path: "following",
      match: cursor ? { _id: { $gt: cursor } } : {}, // Only fetch following users after the cursor
      options: {
        sort: { _id: 1 },
        limit: limit + 1,
      },
      select: "_id username fullName profilePicture settings followRequests",
      populate: { path: "settings" },
    })
    .exec();

  if (!foundUser) throw new Error("User not found.");

  const following = foundUser.following;

  const hasNextPage = following.length > limit;
  if (hasNextPage) following.pop();

  return {
    following,
    nextCursor: hasNextPage ? following[following.length - 1]._id : null,
    hasNextPage,
  };
};

export const getUserCollages = async (_, { userId }) => {
  const foundUser = await User.findById(userId)
    .populate({
      path: "collages",
      match: { archived: false },
      select: "_id coverImage",
    })
    .exec();

  if (!foundUser) throw new Error("User not found for the provided ID.");
  return foundUser.collages;
};

export const getRepostedCollages = async (_, { userId }, { user }) => {
  isUser(user);
  const foundUser = await User.findById(userId)
    .populate({
      path: "repostedCollages",
      match: { archived: false },
      select: "_id coverImage",
    })
    .exec();

  if (!foundUser) throw new Error("User not found for the provided ID.");
  return foundUser.repostedCollages;
};

export const getTaggedCollages = async (
  _,
  { cursor, limit = 20 },
  { user }
) => {
  isUser(user);

  // Find the user and apply pagination based on cursor and limit
  const foundUser = await User.findById(user)
    .populate({
      path: "taggedCollages",
      match: {
        archived: false,
        ...(cursor && { _id: { $gt: cursor } }), // Only fetch collages after the cursor
      },
      options: {
        sort: { _id: 1 }, // Sort by _id to support cursor-based pagination
        limit: limit + 1, // Fetch one extra to check if there are more
      },
      select: "_id coverImage",
    })
    .exec();

  if (!foundUser) throw new Error("User not found for the provided ID.");

  const taggedCollages = foundUser.taggedCollages;

  // Check if there's a next page by seeing if we fetched an extra item
  const hasNextPage = taggedCollages.length > limit;
  if (hasNextPage) taggedCollages.pop(); // Remove the extra item

  return {
    collages: taggedCollages,
    nextCursor: hasNextPage
      ? taggedCollages[taggedCollages.length - 1]._id
      : null,
    hasNextPage,
  };
};

export const getSavedCollages = async (_, { cursor, limit = 20 }, { user }) => {
  isUser(user);

  const foundUser = await User.findById(user)
    .populate({
      path: "savedCollages",
      match: {
        archived: false,
        ...(cursor && { _id: { $gt: cursor } }),
      },
      options: {
        sort: { _id: 1 },
        limit: limit + 1,
      },
      select: "_id coverImage",
    })
    .exec();

  if (!foundUser) throw new Error("User not found for the provided ID.");

  const savedCollages = foundUser.savedCollages;

  const hasNextPage = savedCollages.length > limit;
  if (hasNextPage) savedCollages.pop();

  return {
    collages: savedCollages,
    nextCursor: hasNextPage
      ? savedCollages[savedCollages.length - 1]._id
      : null,
    hasNextPage,
  };
};

export const getArchivedCollages = async (
  _,
  { cursor, limit = 20 },
  { user }
) => {
  isUser(user);

  const foundUser = await User.findById(user)
    .populate({
      path: "archivedCollages",
      match: cursor ? { _id: { $gt: cursor } } : {}, // Only fetch collages after the cursor
      options: {
        sort: { _id: 1 },
        limit: limit + 1,
      },
      select: "_id coverImage",
    })
    .exec();

  if (!foundUser) throw new Error("User not found for the provided ID.");

  const archivedCollages = foundUser.archivedCollages;

  const hasNextPage = archivedCollages.length > limit;
  if (hasNextPage) archivedCollages.pop();

  return {
    collages: archivedCollages,
    nextCursor: hasNextPage
      ? archivedCollages[archivedCollages.length - 1]._id
      : null,
    hasNextPage,
  };
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
