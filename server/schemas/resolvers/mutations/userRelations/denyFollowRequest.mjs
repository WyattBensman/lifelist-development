import { User } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

const denyFollowRequest = async (_, { userIdToDeny }, { user }) => {
  try {
    isUser(user);

    // Remove the denied follow request from the user's followerRequests list
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        $pull: {
          followRequests: {
            userId: userIdToDeny,
          },
        },
      },
      { new: true }
    );

    return {
      success: true,
      message: "Follow request denied.",
      followRequests: updatedUser.followRequests,
    };
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred during denying follow request.");
  }
};

export default denyFollowRequest;
