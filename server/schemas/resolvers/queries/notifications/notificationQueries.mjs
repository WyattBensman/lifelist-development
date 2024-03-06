import { User } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

export const getUserNotifications = async (_, __, { user }) => {
  try {
    isUser(user);

    // Retrieve user and populate notifications
    const userNotifications = await User.findById(user._id).populate({
      path: "notifications",
      populate: {
        path: "sender",
        model: "User",
        select: "username fullName profilePicture",
      },
    });

    if (!userNotifications) {
      throw new Error("User not found.");
    }

    return userNotifications.notifications || [];
  } catch (error) {
    throw new Error(`Error fetching user's notifications: ${error.message}`);
  }
};

export const getUserFollowRequest = async (_, __, { user }) => {
  try {
    isUser(user);

    const user = await User.findById(user._id).populate({
      path: "followRequests.userId",
      select: "username fullName profilePicture",
    });

    if (!user) {
      throw new Error("User not found for the provided ID.");
    }

    return user.followRequests;
  } catch (error) {
    throw new Error(
      `Error fetching user's follower requests: ${error.message}`
    );
  }
};
