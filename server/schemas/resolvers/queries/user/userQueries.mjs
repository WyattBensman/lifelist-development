import { User } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

export const getUserProfileById = async (_, { userId }, { user }) => {
  try {
    isUser(user);

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

    return {
      ...foundUser.toObject(),
    };
  } catch (error) {
    throw new Error("Database error: " + error.message);
  }
};

export const getUserCounts = async (_, { userId }) => {
  try {
    const [followersCount, followingCount] = await Promise.all([
      User.countDocuments({ following: userId }), // Count users following this user
      User.countDocuments({ followers: userId }), // Count users this user is following
    ]);

    const foundUser = await User.findById(userId)
      .populate({
        path: "collages",
        match: { archived: false },
        select: "_id",
      })
      .exec();

    if (!foundUser) {
      throw new Error("User not found.");
    }

    // Count non-archived collages
    const collagesCount = foundUser.collages.length;

    return {
      followersCount,
      followingCount,
      collagesCount,
    };
  } catch (error) {
    throw new Error("Database error: " + error.message);
  }
};

export const getCollagesAndReposts = async (
  _,
  { userId, collagesCursor, repostsCursor, limit = 15 }
) => {
  try {
    // Fetch the user and populate both collages and reposted collages
    const foundUser = await User.findById(userId)
      .populate({
        path: "collages",
        match: {
          archived: false,
          ...(collagesCursor && { _id: { $gt: collagesCursor } }), // Pagination filter
        },
        options: { sort: { _id: 1 }, limit: limit + 1 }, // Fetch extra for pagination
        select: "_id coverImage",
      })
      .populate({
        path: "repostedCollages",
        match: {
          archived: false,
          ...(repostsCursor && { _id: { $gt: repostsCursor } }), // Pagination filter
        },
        options: { sort: { _id: 1 }, limit: limit + 1 }, // Fetch extra for pagination
        select: "_id coverImage",
      })
      .exec();

    if (!foundUser) throw new Error("User not found."); // Handle invalid user

    // Extract collages and reposted collages
    const collages = foundUser.collages || [];
    const repostedCollages = foundUser.repostedCollages || [];

    // Determine if there's another page of collages
    const collagesHasNextPage = collages.length > limit;
    if (collagesHasNextPage) collages.pop(); // Remove extra item for clean response

    // Determine if there's another page of reposted collages
    const repostsHasNextPage = repostedCollages.length > limit;
    if (repostsHasNextPage) repostedCollages.pop(); // Remove extra item for clean response

    // Return the paginated response
    return {
      collages: {
        items: collages,
        nextCursor: collagesHasNextPage
          ? collages[collages.length - 1]._id
          : null, // Set cursor to the last item's ID or null
        hasNextPage: collagesHasNextPage,
      },
      repostedCollages: {
        items: repostedCollages,
        nextCursor: repostsHasNextPage
          ? repostedCollages[repostedCollages.length - 1]._id
          : null, // Set cursor to the last item's ID or null
        hasNextPage: repostsHasNextPage,
      },
    };
  } catch (error) {
    console.error("Error fetching collages and reposts:", error);
    throw new Error("Database error: " + error.message); // Return a generic database error
  }
};

export const checkIsFollowing = async (_, { userId }, { user }) => {
  try {
    // Check if the current user is following the requested user
    const currentUserData = await User.findById(user)
      .select("following")
      .exec();

    if (!currentUserData) {
      throw new Error("Authenticated user not found.");
    }

    const isFollowing = currentUserData.following.some(
      (followingId) => followingId.toString() === userId.toString()
    );

    return { isFollowing };
  } catch (error) {
    console.error("Error checking follow status:", error);
    return false;
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

export const getUserData = async (_, __, { user }) => {
  isUser(user);

  const userData = await User.findById(user, [
    "profilePicture",
    "fullName",
    "username",
    "bio",
    "birthday",
    "gender",
    "email",
    "phoneNumber",
    "settings",
  ]).exec();

  return {
    profilePicture: userData.profilePicture,
    fullName: userData.fullName,
    username: userData.username,
    bio: userData.bio,
    birthday: userData.birthday,
    gender: userData.gender,
    email: userData.email,
    phoneNumber: userData.phoneNumber,
    settings: userData.settings,
  };
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
