import { User } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

const denyFollowRequest = async (_, { userIdToDeny }, { user }) => {
  try {
    isUser(user);

    // Remove the follow request made by userIdToDeny from the current user's followRequests list
    const updatedUser = await User.findByIdAndUpdate(
      user,
      { $pull: { followRequests: { userId: userIdToDeny } } },
      { new: true }
    );

    if (!updatedUser) {
      throw new Error("Current user not found.");
    }

    // Remove the current user from the pendingFriendRequests list of the user whose request is being denied
    await User.findByIdAndUpdate(
      userIdToDeny,
      { $pull: { pendingFriendRequests: user } },
      { new: true }
    );

    return {
      success: true,
      message: "Follow request successfully denied.",
    };
  } catch (error) {
    console.error(`Deny Follow Request Error: ${error.message}`);
    throw new Error("Unable to deny follow request due to a server error.");
  }
};

export default denyFollowRequest;
