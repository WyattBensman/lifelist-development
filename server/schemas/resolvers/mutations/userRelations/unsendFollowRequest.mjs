import { User } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

const unsendFollowRequest = async (_, { userIdToUnfollow }, { user }) => {
  try {
    isUser(user);

    // Check if the friend request exists
    const friendRequestExists = await User.findOne({
      _id: userIdToUnfollow,
      "followerRequests.userId": user._id,
    });

    if (!friendRequestExists) {
      throw new Error("No friend request exists to unsend.");
    }

    // Remove the friend request from the recipient's list
    const updatedUser = await User.findByIdAndUpdate(
      userIdToUnfollow,
      {
        $pull: {
          followerRequests: { userId: user._id },
        },
      },
      { new: true }
    );

    return updatedUser;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred during unsending follow request.");
  }
};

export default unsendFollowRequest;
