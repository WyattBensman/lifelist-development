import {
  User,
  Conversation,
  CameraAlbum,
  Collage,
  CameraShot,
  Comment,
  LifeList,
  PrivacyGroup,
  Message,
} from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

const deleteUser = async (_, __, { user }) => {
  try {
    isUser(user);

    // Find the user to delete
    const userToDelete = await User.findByIdAndDelete(user);

    // Check if the user exists
    if (!userToDelete) {
      console.error("User not found.");
      throw new Error("User not found.");
    }

    // Delete the user's lifelist
    await LifeList.deleteOne({ author: user });

    // Delete all privacy groups where the user is the owner
    await PrivacyGroup.deleteMany({ author: user });

    // Delete all messages sent by the user
    await Message.deleteMany({ sender: user });

    // Delete all conversations the user is in
    await Conversation.deleteMany({ participants: user });

    // Delete all collages the user has posted
    await Collage.deleteMany({ author: user });

    // Delete all camera albums the user has created
    await CameraAlbum.deleteMany({ author: user });

    // Delete all camera shots associated with the user
    await CameraShot.deleteMany({ user: user });

    // Remove the user from the followers' following field
    await User.updateMany({ followers: user }, { $pull: { following: user } });

    // Remove the user from the following users' followers field
    await User.updateMany({ following: user }, { $pull: { followers: user } });

    // Untag the user from all tagged collages
    await Collage.updateMany({ tagged: user }, { $pull: { tagged: user } });

    // Delete all comments associated with the user and remove them from collages
    await Comment.deleteMany({ author: user });

    // Remove the user's comments from all collages
    await Collage.updateMany({}, { $pull: { comments: { author: user } } });

    return {
      success: true,
      message: `User ${userToDelete.id} deleted successfully.`,
    };
  } catch (error) {
    console.error(`Error during user deletion: ${error.message}`);
    throw new Error("An error occurred during user deletion.");
  }
};

export default deleteUser;
