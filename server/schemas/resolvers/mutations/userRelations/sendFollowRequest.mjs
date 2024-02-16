import { User } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

export const sendFollowRequest = async (_, { userIdToFollow }, { user }) => {
  try {
    isUser(user);

    // Update the user's followerRequests list
    const updatedUser = await User.findByIdAndUpdate(
      userIdToFollow,
      {
        $addToSet: {
          followerRequests: {
            userId: user.id,
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
