import { User } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

export const getUserProfileById = async (_, { userId }) => {
  try {
    const user = await User.findById(userId).populate({
      path: "collages",
      select: "_id images",
    });

    if (!user) {
      throw new Error("User not found.");
    }

    return user;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred while fetching the user by ID.");
  }
};

export const searchUsers = async (_, { query }) => {
  try {
    const users = await User.find({
      $or: [
        { username: { $regex: query, $options: "i" } },
        { fullName: { $regex: query, $options: "i" } },
      ],
    }).select("username fullName profilePicture");
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred while fetching the user by username.");
  }
};

export const getFollowers = async (_, { userId }, { user }) => {
  try {
    isUser(user);

    const user = await User.findById(userId).populate({
      path: "followers",
      select: "_id username fullName profilePicture",
    });

    if (!user) {
      throw new Error("User not found.");
    }

    return user.followers;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred while fetching the user's followers.");
  }
};

export const getFollowing = async (_, { userId }, { user }) => {
  try {
    isUser(user);

    const user = await User.findById(userId).populate({
      path: "following",
      select: "_id username fullName profilePicture",
    });

    if (!user) {
      throw new Error("User not found.");
    }

    return user.following;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred while fetching the user's following.");
  }
};

export const getUserCollages = async (_, { userId }) => {
  try {
    const user = await User.findById(userId).populate("collages").populate({
      path: "collages",
      select: "_id coverImage",
    });

    if (!user) {
      throw new Error("User not found for the provided ID.");
    }

    return user.collages;
  } catch (error) {
    throw new Error(`Error fetching user's collages: ${error.message}`);
  }
};

export const getUserRepostedCollages = async (_, { userId }, { user }) => {
  try {
    isUser(user);

    const user = await User.findById(userId).populate({
      path: "repostedCollages",
      select: "_id coverImage",
    });

    if (!user) {
      throw new Error("User not found for the provided ID.");
    }

    return user.repostedCollages;
  } catch (error) {
    throw new Error(
      `Error fetching user's reposted collages: ${error.message}`
    );
  }
};

export const getUserTaggedCollages = async (_, { userId }, { user }) => {
  try {
    isUser(user);

    const user = await User.findById(userId).populate({
      path: "taggedCollages",
      select: "_id coverImage",
    });

    if (!user) {
      throw new Error("User not found for the provided ID.");
    }

    return user.taggedCollages;
  } catch (error) {
    throw new Error(`Error fetching user's tagged collages: ${error.message}`);
  }
};

export const getUserSavedCollages = async (_, __, { user }) => {
  try {
    isUser(user);

    const user = await User.findById(user._id).populate({
      path: "savedCollages",
      select: "_id coverImage",
    });

    if (!user) {
      throw new Error("User not found for the provided ID.");
    }

    return user.savedCollages;
  } catch (error) {
    throw new Error(`Error fetching user's saved collages: ${error.message}`);
  }
};

export const getUserArchives = async (_, __, { user }) => {
  try {
    isUser(user);

    const user = await User.findById(user._id).populate({
      path: "archivedCollages",
      select: "_id coverImage",
    });

    if (!user) {
      throw new Error("User not found for the provided ID.");
    }
    return user.archivedCollages;
  } catch (error) {
    throw new Error(
      `Error fetching user's archived collages: ${error.message}`
    );
  }
};

export const getUserLogbook = async (_, __, { user }) => {
  try {
    isUser(user);

    const user = await User.findById(user.id).populate("logbook");

    if (!user) {
      throw new Error("User not found for the provided ID.");
    }

    return user.logbook;
  } catch (error) {
    throw new Error(`Error fetching user's logbook: ${error.message}`);
  }
};
