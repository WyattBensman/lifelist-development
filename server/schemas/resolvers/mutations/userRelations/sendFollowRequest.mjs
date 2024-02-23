import { User } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

const sendFollowRequest = async (_, { userIdToFollow }, { user }) => {
  try {
    isUser(user);

    // Check if any friend request already exists
    const alreadyHasFriendRequest = await User.findOne({
      _id: userIdToFollow,
      "followerRequests.userId": user._id,
    });

    if (alreadyHasFriendRequest) {
      throw new Error("A friend request already exists.");
    }

    // Update the user's followerRequests list
    const updatedUser = await User.findByIdAndUpdate(
      userIdToFollow,
      {
        $addToSet: {
          followerRequests: {
            userId: user._id,
            status: "pending",
          },
        },
      },
      { new: true }
    );

    return updatedUser;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred during sending follow request.");
  }
};

export default sendFollowRequest;
