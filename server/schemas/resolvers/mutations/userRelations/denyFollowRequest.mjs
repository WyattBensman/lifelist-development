import { User } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

const denyFollowRequest = async (_, { userIdToDeny }, { user }) => {
  try {
    isUser(user);

    // Remove the follow request made by userIdToDeny from the current user's followRequests list
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { $pull: { followRequests: { userId: userIdToDeny } } },
      { new: true }
    );

    if (!updatedUser) {
      throw new Error("Current user not found.");
    }

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
