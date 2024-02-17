import { User } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

export const denyFollowRequest = async (_, { userIdToDeny }, { user }) => {
  try {
    isUser(user);

    // Remove the denied follow request from the user's followerRequests list
    const updatedUser = await User.findByIdAndUpdate(
      user.id,
      {
        $pull: {
          followerRequests: {
            userId: userIdToDeny,
          },
        },
      },
      { new: true }
    );

    return updatedUser;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred during denying follow request.");
  }
};