import { User, LogbookItem } from "../../../../models/index.mjs";
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

    const logbookItems = await LogbookItem.find({ user: user._id });

    return logbookItems;
  } catch (error) {
    throw new Error(`Error fetching user's logbook: ${error.message}`);
  }
};

export const getBlockedUsers = async (_, __, { user }) => {
  try {
    isUser(user);

    const currentUser = await User.findById(user._id).populate({
      path: "blocked",
      select: "_id username fullName profilePicture",
    });

    if (!currentUser) {
      throw new Error("User not found for the provided ID.");
    }

    return currentUser.blocked;
  } catch (error) {
    throw new Error(`Error fetching blocked users: ${error.message}`);
  }
};

export const getFlowpageLinks = async (_, { userId }, { user }) => {
  try {
    isUser(user);

    const user = await User.findById(userId).select("flowpageLinks");

    if (!user) {
      throw new Error("User not found for the provided ID.");
    }

    return user.flowpageLinks;
  } catch (error) {
    throw new Error(`Error fetching Flowpage links: ${error.message}`);
  }
};

export const getUserProfileInformation = async (_, __, { user }) => {
  try {
    isUser(user);

    const userProfile = await User.findById(user._id).select(
      "profilePicture fullName username bio"
    );

    return userProfile;
  } catch (error) {
    throw new Error(
      `Error fetching user profile information: ${error.message}`
    );
  }
};

export const getUserContactInformation = async (_, __, { user }) => {
  try {
    isUser(user);

    const userContactInfo = await User.findById(user._id).select(
      "email phoneNumber"
    );

    return userContactInfo;
  } catch (error) {
    throw new Error(
      `Error fetching user contact information: ${error.message}`
    );
  }
};

export const getUserIdentityInformation = async (_, __, { user }) => {
  try {
    isUser(user);

    const userIdentityInfo = await User.findById(user._id).select(
      "birthday gender"
    );

    return userIdentityInfo;
  } catch (error) {
    throw new Error(
      `Error fetching user identity information: ${error.message}`
    );
  }
};

export const getUserSettingsInformation = async (_, __, { user }) => {
  try {
    isUser(user);

    const userSettingsInfo = await User.findById(user._id).select("settings");

    return userSettingsInfo;
  } catch (error) {
    throw new Error(
      `Error fetching user settings information: ${error.message}`
    );
  }
};
