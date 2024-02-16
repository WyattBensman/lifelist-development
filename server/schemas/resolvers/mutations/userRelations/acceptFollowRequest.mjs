import { User } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

export const acceptFollowRequest = async (_, { userIdToAccept }, { user }) => {
  try {
    isUser(user);

    // Update the user's following list and the follower's followers list
    const updatedUser = await User.findByIdAndUpdate(
      user.id,
      {
        $addToSet: { following: userIdToAccept },
        $pull: { followerRequests: { userId: userIdToAccept } },
      },
      { new: true }
    );

    // Update the follower's followers list
    await User.findByIdAndUpdate(
      userIdToAccept,
      { $addToSet: { followers: user.id } },
      { new: true }
    );

    return updatedUser;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred during accepting follow request.");
  }
};
