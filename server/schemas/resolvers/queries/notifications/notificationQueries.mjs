import { User } from "../../../../models/index.mjs";

export const getUserNotifications = async (_, __, { user }) => {
  try {
    // Retrieve user and populate notifications
    const userWithNotifications = await User.findById(user.id).populate(
      "notifications"
    );

    if (!userWithNotifications) {
      throw new Error("User not found.");
    }

    return userWithNotifications.notifications || [];
  } catch (error) {
    throw new Error(`Error fetching user's notifications: ${error.message}`);
  }
};

export const getUserFollowRequest = async (_, __, { user }) => {
  // Check if the user is authenticated
  isUser(user);

  try {
    const user = await User.findById(user.id).populate(
      "followerRequests.userId"
    );

    if (!user) {
      throw new Error("User not found for the provided ID.");
    }

    return user.followerRequests;
  } catch (error) {
    throw new Error(
      `Error fetching user's follower requests: ${error.message}`
    );
  }
};
