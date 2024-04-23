import { User } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";
import createNotification from "../notifications/createNotification.mjs";

const acceptFollowRequest = async (_, { userIdToAccept }, { user }) => {
  try {
    isUser(user);

    const session = await mongoose.startSession();
    session.startTransaction();

    const newFollower = await User.findByIdAndUpdate(
      userIdToAccept,
      { $addToSet: { following: user._id } },
      { new: true, session }
    );
    if (!newFollower) throw new Error("User to accept not found.");

    const acceptor = await User.findByIdAndUpdate(
      user._id,
      {
        $addToSet: { followers: userIdToAccept },
        $pull: { followRequests: { userId: userIdToAccept } },
      },
      { new: true, session }
    );
    if (!acceptor) throw new Error("Acceptor user not found.");

    // Notify the user whose follow request was accepted
    await createNotification(
      {
        recipientId: userIdToAccept,
        senderId: user._id,
        type: "FOLLOW_ACCEPTED",
        message: `${user.username} has accepted your follow request.`,
      },
      session
    );

    // Notify the acceptor that they have a new follower
    await createNotification(
      {
        recipientId: user._id,
        senderId: userIdToAccept,
        type: "NEW_FOLLOWER",
        message: `${newFollower.username} is now following you.`,
      },
      session
    );

    await session.commitTransaction();
    session.endSession();

    return {
      success: true,
      message: "Follow request accepted.",
    };
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred during accepting follow request.");
  } finally {
    session.endSession();
  }
};

export default acceptFollowRequest;
