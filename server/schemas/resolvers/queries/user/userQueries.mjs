import { User } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

export const getUserProfileById = async (
  _,
  { userId, collagesCursor, repostsCursor, limit = 20 },
  { user }
) => {
  try {
    isUser(user);

    const foundUser = await User.findById(userId)
      .select("_id fullName username bio profilePicture")
      .exec();

    if (!foundUser) {
      throw new Error("User not found.");
    }

    // Fetch paginated collages
    const collagesQuery = { archived: false };
    if (collagesCursor) {
      collagesQuery._id = { $gt: collagesCursor }; // Cursor condition
    }
    const collages = await Collage.find(collagesQuery)
      .sort({ _id: 1 }) // Sort by ascending _id for cursor pagination
      .limit(limit + 1) // Fetch one extra record to determine if there's a next page
      .select("_id coverImage")
      .exec();

    const hasMoreCollages = collages.length > limit;
    if (hasMoreCollages) collages.pop(); // Remove the extra record

    // Fetch paginated reposted collages
    const repostsQuery = { archived: false };
    if (repostsCursor) {
      repostsQuery._id = { $gt: repostsCursor }; // Cursor condition
    }
    const repostedCollages = await Repost.find(repostsQuery)
      .sort({ _id: 1 }) // Sort by ascending _id for cursor pagination
      .limit(limit + 1) // Fetch one extra record to determine if there's a next page
      .select("_id coverImage")
      .exec();

    const hasMoreReposts = repostedCollages.length > limit;
    if (hasMoreReposts) repostedCollages.pop(); // Remove the extra record

    // Count total collages (non-paginated)
    const collagesCount = await Collage.countDocuments({ archived: false });

    return {
      ...foundUser.toObject(),
      collages,
      collagesCount,
      repostedCollages,
      hasMoreCollages,
      hasMoreReposts,
      nextCollagesCursor: hasMoreCollages
        ? collages[collages.length - 1]._id
        : null,
      nextRepostsCursor: hasMoreReposts
        ? repostedCollages[repostedCollages.length - 1]._id
        : null,
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
  { user: currentUser }
) => {
  isUser(currentUser);

  const foundUser = await User.findById(userId)
    .populate({
      path: "followers",
      match: cursor ? { _id: { $gt: cursor } } : {}, // Fetch followers after the cursor
      options: {
        sort: { _id: 1 }, // Sort by _id for cursor-based pagination
        limit: limit + 1, // Fetch one extra item to determine if there's a next page
      },
      select: "_id username fullName profilePicture settings followRequests",
      populate: { path: "settings" },
    })
    .exec();

  if (!foundUser) throw new Error("User not found.");

  console.log("Current User Following:", currentUser.following);

  const followersWithStatus = foundUser.followers.map((follower) => {
    console.log("Processing Follower:", follower._id);
    console.log("Follower FollowRequests:", follower.followRequests);

    const isFollowing = currentUser.following?.includes(follower._id) || false; // Safe check for undefined
    const hasSentRequest = Array.isArray(follower.followRequests)
      ? follower.followRequests.some(
          (req) => req.toString() === currentUser._id.toString()
        )
      : false;

    return {
      user: follower,
      relationshipStatus: isFollowing
        ? "Following"
        : hasSentRequest
        ? "Requested"
        : "Follow",
      isPrivate: follower.settings?.isProfilePrivate || false,
      hasSentFollowRequest: hasSentRequest,
    };
  });

  const hasNextPage = followersWithStatus.length > limit;
  if (hasNextPage) followersWithStatus.pop();

  return {
    users: followersWithStatus,
    nextCursor: hasNextPage
      ? followersWithStatus[followersWithStatus.length - 1].user._id
      : null,
    hasNextPage,
  };
};

export const getFollowing = async (
  _,
  { userId, cursor, limit = 20 },
  { user: currentUser }
) => {
  isUser(currentUser);

  const foundUser = await User.findById(userId)
    .populate({
      path: "following",
      match: cursor ? { _id: { $gt: cursor } } : {}, // Fetch following users after the cursor
      options: {
        sort: { _id: 1 }, // Sort by _id for cursor-based pagination
        limit: limit + 1, // Fetch one extra item to determine if there's a next page
      },
      select: "_id username fullName profilePicture settings followRequests",
      populate: { path: "settings" },
    })
    .exec();

  if (!foundUser) {
    console.log("User not found for userId:", userId);
    throw new Error("User not found.");
  }

  console.log("Current User ID:", currentUser._id);
  console.log("Found User Following Count:", foundUser.following.length);

  const followingWithStatus = foundUser.following.map((followingUser) => {
    console.log("Processing Following User:", followingUser._id);
    console.log("Following User FollowRequests:", followingUser.followRequests);

    const isFollowedByCurrentUser =
      currentUser.followers?.includes(followingUser._id) || false; // Safe check for undefined
    const hasSentRequest = Array.isArray(followingUser.followRequests)
      ? followingUser.followRequests.some(
          (req) => req.toString() === currentUser._id.toString()
        )
      : false;

    return {
      user: followingUser,
      relationshipStatus: isFollowedByCurrentUser
        ? "Following Back"
        : hasSentRequest
        ? "Requested"
        : "Following",
      isPrivate: followingUser.settings?.isProfilePrivate || false,
      hasSentFollowRequest: hasSentRequest,
    };
  });

  console.log("Processed Following List:", followingWithStatus);

  const hasNextPage = followingWithStatus.length > limit;
  if (hasNextPage) followingWithStatus.pop();

  return {
    users: followingWithStatus,
    nextCursor: hasNextPage
      ? followingWithStatus[followingWithStatus.length - 1].user._id
      : null,
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
  const foundUser = await User.findById(users)
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
