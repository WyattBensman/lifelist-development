import { User } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

export const getUserNotifications = async (_, __, { user }) => {
  isUser(user);
  const foundUser = await User.findById(user._id)
    .populate({
      path: "notifications",
      populate: {
        path: "sender",
        model: "User",
        select: "username fullName profilePicture",
      },
    })
    .exec();
  if (!foundUser) throw new Error("User not found.");
  return foundUser.notifications || [];
};

export const getUserFollowRequest = async (_, __, { user }) => {
  isUser(user);
  const foundUser = await User.findById(user._id)
    .populate({
      path: "followRequests.userId",
      select: "username fullName profilePicture",
    })
    .exec();
  if (!foundUser) throw new Error("User not found for the provided ID.");
  return foundUser.followRequests;
};
