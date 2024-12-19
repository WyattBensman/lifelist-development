import { Moment, User } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

export const getUserProfileById = async (
  _,
  { userId, collagesCursor, repostsCursor, limit = 15 },
  { user }
) => {
  try {
    // Fetch user and relationships
    const foundUser = await User.findById(userId)
      .populate({
        path: "collages",
        match: {
          archived: false,
          ...(collagesCursor && { _id: { $gt: collagesCursor } }),
        },
        options: { sort: { _id: 1 }, limit: limit + 1 },
        select: "_id coverImage",
      })
      .populate({
        path: "repostedCollages",
        match: {
          archived: false,
          ...(repostsCursor && { _id: { $gt: repostsCursor } }),
        },
        options: { sort: { _id: 1 }, limit: limit + 1 },
        select: "_id coverImage",
      })
      .select(
        "_id fullName username bio profilePicture followers following followRequests"
      )
      .exec();

    if (!foundUser) {
      throw new Error("User not found.");
    }

    // Determine pagination for collages
    const collages = foundUser.collages || [];
    const collagesHasNextPage = collages.length > limit;
    if (collagesHasNextPage) collages.pop(); // Remove extra item for pagination

    // Determine pagination for reposted collages
    const repostedCollages = foundUser.repostedCollages || [];
    const repostsHasNextPage = repostedCollages.length > limit;
    if (repostsHasNextPage) repostedCollages.pop();

    // Compute relationship states
    const isFollowing = foundUser.followers.some((followerId) =>
      followerId.equals(user)
    );
    const isFollowedBy = foundUser.following.some((followingId) =>
      followingId.equals(user)
    );
    const isFollowRequested = foundUser.followRequests.some((requestId) =>
      requestId.equals(user)
    );

    // Count followers, following, and active moments
    const followersCount = foundUser.followers.length;
    const followingCount = foundUser.following.length;
    const collagesCount = collages.length;

    const hasActiveMoments = await Moment.exists({
      author: userId,
      expiresAt: { $gt: new Date() },
    });

    return {
      _id: foundUser._id,
      fullName: foundUser.fullName,
      username: foundUser.username,
      bio: foundUser.bio,
      profilePicture: foundUser.profilePicture,
      collages: {
        items: collages,
        nextCursor: collagesHasNextPage
          ? collages[collages.length - 1]._id
          : null,
        hasNextPage: collagesHasNextPage,
      },
      repostedCollages: {
        items: repostedCollages,
        nextCursor: repostsHasNextPage
          ? repostedCollages[repostedCollages.length - 1]._id
          : null,
        hasNextPage: repostsHasNextPage,
      },
      followersCount,
      followingCount,
      collagesCount,
      isFollowing,
      isFollowedBy,
      isFollowRequested,
      hasActiveMoments: Boolean(hasActiveMoments),
    };
  } catch (error) {
    console.error("Error fetching user profile:", error.message);
    throw new Error("Failed to fetch user profile.");
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

export const getCollagesRepostsMoments = async (
  _,
  { userId, collagesCursor, repostsCursor, limit = 15 }
) => {
  try {
    // Fetch the user and populate collages, reposted collages, and moments
    const foundUser = await User.findById(userId)
      .populate({
        path: "collages",
        match: {
          archived: false,
          ...(collagesCursor && { _id: { $gt: collagesCursor } }), // Pagination filter
        },
        options: { sort: { _id: 1 }, limit: limit + 1 },
        select: "_id coverImage",
      })
      .populate({
        path: "repostedCollages",
        match: {
          archived: false,
          ...(repostsCursor && { _id: { $gt: repostsCursor } }),
        },
        options: { sort: { _id: 1 }, limit: limit + 1 },
        select: "_id coverImage",
      })
      .populate({
        path: "moments",
        match: { expiresAt: { $gte: new Date() } }, // Only include active moments
        options: { sort: { createdAt: -1 } }, // Most recent moments first
        select: "_id expiresAt createdAt", // Return the fields needed
      })
      .exec();

    if (!foundUser) throw new Error("User not found.");

    // Extract collages and reposted collages
    const collages = foundUser.collages || [];
    const repostedCollages = foundUser.repostedCollages || [];
    const moments = foundUser.moments || [];

    // Pagination for collages
    const collagesHasNextPage = collages.length > limit;
    if (collagesHasNextPage) collages.pop();

    // Pagination for reposted collages
    const repostsHasNextPage = repostedCollages.length > limit;
    if (repostsHasNextPage) repostedCollages.pop();

    // Response
    return {
      collages: {
        items: collages,
        nextCursor: collagesHasNextPage
          ? collages[collages.length - 1]._id
          : null,
        hasNextPage: collagesHasNextPage,
      },
      repostedCollages: {
        items: repostedCollages,
        nextCursor: repostsHasNextPage
          ? repostedCollages[repostedCollages.length - 1]._id
          : null,
        hasNextPage: repostsHasNextPage,
      },
      moments: moments.map((moment) => ({
        _id: moment._id,
        expiresAt: moment.expiresAt,
        createdAt: moment.createdAt,
      })),
    };
  } catch (error) {
    console.error("Error fetching profile data:", error);
    throw new Error("Database error: " + error.message);
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

export const getAllUsers = async (
  _,
  { limit = 12, cursor, searchQuery },
  { user: currentUser }
) => {
  try {
    if (!currentUser) throw new Error("Unauthorized.");

    // Cursor-based pagination and search query
    const query = {
      ...(cursor ? { _id: { $gt: cursor } } : {}),
      ...(searchQuery
        ? {
            username: { $regex: searchQuery, $options: "i" }, // Case-insensitive search
          }
        : {}),
    };

    const users = await User.find(query)
      .sort({ _id: 1 }) // Ensure consistent ordering for pagination
      .limit(limit + 1) // Fetch one extra user to check for next page
      .select(
        "_id fullName email phoneNumber username profilePicture settings followRequests"
      )
      .populate("settings") // Populate settings for privacy info
      .exec();

    // Map users to include relationship status
    const usersWithStatus = users.map((user) => {
      const isFollowing = currentUser.following?.includes(user._id) || false;
      const hasSentRequest = Array.isArray(user.followRequests)
        ? user.followRequests.some(
            (req) => req.toString() === currentUser._id.toString()
          )
        : false;

      return {
        user,
        relationshipStatus: isFollowing
          ? "Following"
          : hasSentRequest
          ? "Requested"
          : "Follow",
        isPrivate: user.settings?.isProfilePrivate || false,
        hasSentFollowRequest: hasSentRequest,
      };
    });

    // Check for next page
    const hasNextPage = usersWithStatus.length > limit;
    if (hasNextPage) usersWithStatus.pop(); // Remove extra user

    return {
      users: usersWithStatus,
      nextCursor: hasNextPage
        ? usersWithStatus[usersWithStatus.length - 1].user._id
        : null,
      hasNextPage,
    };
  } catch (error) {
    throw new Error("Failed to fetch users");
  }
};
