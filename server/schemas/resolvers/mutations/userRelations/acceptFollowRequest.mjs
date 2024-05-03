import { User } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";
import createNotification from "../notifications/createNotification.mjs";

const acceptFollowRequest = async (_, { userIdToAccept }, { user }) => {
  try {
    isUser(user);

    // Add the current user to the 'following' list of the user they want to accept
    const newFollower = await User.findByIdAndUpdate(
      userIdToAccept,
      { $addToSet: { following: user._id } },
      { new: true }
    );
    if (!newFollower) throw new Error("User to accept not found.");

    // Add the user to accept to the 'followers' list of the current user and remove from followRequests
    const acceptor = await User.findByIdAndUpdate(
      user._id,
      {
        $addToSet: { followers: userIdToAccept },
        $pull: { followRequests: { userId: userIdToAccept } },
      },
      { new: true }
    );
    if (!acceptor) throw new Error("Current user's document not found.");

    // Notify the user whose follow request was accepted
    await createNotification({
      recipientId: userIdToAccept,
      senderId: user._id,
      type: "FOLLOW_ACCEPTED",
      message: `${user.fullName} has successfully accepted your follow request.`,
    });

    // Notify the current user that they have a new follower
    await createNotification({
      recipientId: user._id,
      senderId: userIdToAccept,
      type: "NEW_FOLLOWER",
      message: `${newFollower.fullName} is now following you.`,
    });

    return {
      success: true,
      message: "Follow request successfully accepted.",
    };
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred during accepting follow request.");
  }
};

export default acceptFollowRequest;
