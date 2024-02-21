import { User } from "../../../../models/index.mjs";

export const getUserById = async (_, { userId }) => {
  try {
    const user = await User.findById(userId);
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
        { username: { $regex: query, $options: "i" } }, // Case-insensitive username match
        { fullName: { $regex: query, $options: "i" } }, // Case-insensitive full name match
      ],
    }).select("fName lName username profilePicture");
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred while fetching the user by username.");
  }
};

export const getUserFollowers = async (_, { userId }) => {
  try {
    const user = await User.findById(userId).populate({
      path: "followers",
      select: "username fullName profilePicture",
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

export const getUserFollowing = async (_, { userId }) => {
  try {
    const user = await User.findById(userId).populate({
      path: "following",
      select: "username fullName profilePicture",
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
    const user = await User.findById(userId).populate("collages");

    if (!user) {
      throw new Error("User not found for the provided ID.");
    }

    return user.collages;
  } catch (error) {
    throw new Error(`Error fetching user's collages: ${error.message}`);
  }
};

export const getUserReposts = async (_, { userId }) => {
  try {
    const user = await User.findById(userId).populate("repostedCollages");

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

export const getUserTaggedCollages = async (_, { userId }) => {
  try {
    const user = await User.findById(userId).populate("taggedCollages");

    if (!user) {
      throw new Error("User not found for the provided ID.");
    }

    return user.taggedCollages;
  } catch (error) {
    throw new Error(`Error fetching user's tagged collages: ${error.message}`);
  }
};

export const getUserLifeList = async (_, { userId }) => {
  try {
    const user = await User.findById(userId).populate("lifeList");

    if (!user) {
      throw new Error("User not found for the provided ID.");
    }

    return user.lifeList;
  } catch (error) {
    throw new Error(`Error fetching user's life list: ${error.message}`);
  }
};

export const getUserLogbook = async (_, __, { user }) => {
  // Check if the user is authenticated
  isUser(user);

  try {
    const user = await User.findById(user.id).populate("logbook");

    if (!user) {
      throw new Error("User not found for the provided ID.");
    }

    return user.logbook;
  } catch (error) {
    throw new Error(`Error fetching user's logbook: ${error.message}`);
  }
};

export const getUserArchives = async (_, __, { user }) => {
  // Check if the user is authenticated
  isUser(user);

  try {
    const user = await User.findById(user.id).populate("archivedCollages");

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

export const getUserCameraShots = async (_, __, { user }) => {
  // Check if the user is authenticated
  isUser(user);

  try {
    const user = await User.findById(user.id).populate("cameraShots");
    if (!user) {
      throw new Error("User not found for the provided ID.");
    }
    return user.cameraShots;
  } catch (error) {
    throw new Error(`Error fetching user's camera shots: ${error.message}`);
  }
};

export const getUserCameraAlbums = async (_, __, { user }) => {
  // Check if the user is authenticated
  isUser(user);

  try {
    const user = await User.findById(user.id).populate("cameraAlbums");
    if (!user) {
      throw new Error("User not found for the provided ID.");
    }
    return user.cameraAlbums;
  } catch (error) {
    throw new Error(`Error fetching user's camera albums: ${error.message}`);
  }
};
