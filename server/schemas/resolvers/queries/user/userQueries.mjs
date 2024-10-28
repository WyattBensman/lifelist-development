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

// GET FOLLOWERS
export const getFollowers = async (
  _,
  { userId, limit = 20, offset = 0, searchQuery = "" }
) =>
  /* { user } */
  {
    /* isUser(user); */
    const user = User.findById("663a3129e0ffbeff092b81d4");

    // Fetch the target user and their followers with pagination and search query
    const foundUser = await User.findById(userId)
      .populate({
        path: "followers",
        match: {
          $or: [
            { username: { $regex: searchQuery, $options: "i" } },
            { fullName: { $regex: searchQuery, $options: "i" } },
          ],
        },
        options: {
          limit,
          skip: offset,
        },
        select: "_id username fullName profilePicture settings followRequests",
        populate: { path: "settings" },
      })
      .exec();

    if (!foundUser) throw new Error("User not found.");

    // Calculate follow status for each follower
    const followersWithStatus = foundUser.followers.map((follower) => {
      let followStatus = "Follow"; // Default status
      if (user.following.includes(follower._id)) {
        followStatus = "Following";
      } else if (follower.followRequests.includes(user._id)) {
        followStatus = "Requested";
      }

      return {
        ...follower.toObject(),
        followStatus,
      };
    });

    return followersWithStatus;
  };

// GET FOLLOWING
export const getFollowing = async (
  _,
  { userId, limit = 20, offset = 0, searchQuery = "" },
  { user }
) => {
  isUser(user); // Check user authentication

  const foundUser = await User.findById(userId)
    .populate({
      path: "following",
      match: {
        $or: [
          { username: { $regex: searchQuery, $options: "i" } },
          { fullName: { $regex: searchQuery, $options: "i" } },
        ],
      },
      options: {
        limit,
        skip: offset,
      },
      select: "_id username fullName profilePicture settings followRequests",
      populate: { path: "settings" },
    })
    .exec();

  if (!foundUser) throw new Error("User not found.");

  const followingWithStatus = foundUser.following.map((followingUser) => {
    let followStatus = "Follow";
    if (user.following.includes(followingUser._id)) {
      followStatus = "Following";
    } else if (followingUser.followRequests.includes(user._id)) {
      followStatus = "Requested";
    }

    return {
      ...followingUser.toObject(),
      followStatus,
    };
  });

  return followingWithStatus;
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

export const getTaggedCollages = async (_, { userId }, { user }) => {
  isUser(user);
  const foundUser = await User.findById(userId)
    .populate({
      path: "taggedCollages",
      match: { archived: false },
      select: "_id coverImage",
    })
    .exec();

  if (!foundUser) throw new Error("User not found for the provided ID.");
  return foundUser.taggedCollages;
};

export const getLikedCollages = async (_, __, { user }) => {
  isUser(user);
  const foundUser = await User.findById(user)
    .populate({
      path: "likedCollages",
      match: { archived: false },
      select: "_id coverImage",
    })
    .exec();

  if (!foundUser) throw new Error("User not found.");
  return foundUser.likedCollages;
};

export const getSavedCollages = async (_, __, { user }) => {
  isUser(user);
  const foundUser = await User.findById(user)
    .populate({
      path: "savedCollages",
      match: { archived: false },
      select: "_id coverImage",
    })
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
