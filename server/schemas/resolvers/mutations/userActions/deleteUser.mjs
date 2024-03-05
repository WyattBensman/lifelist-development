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
    // Authenticate
    isUser(user);

    // Find the user to delete
    const userToDelete = await User.findByIdAndDelete(user._id);

    // Check if the user exists
    if (!userToDelete) {
      console.error("User not found.");
      throw new Error("User not found.");
    }

    // Delete the user's lifelist
    await LifeList.deleteOne({ author: user._id });

    // Delete all privacy groups where the user is the owner
    await PrivacyGroup.deleteMany({ author: user._id });

    // Delete all messages sent by the user
    await Message.deleteMany({ sender: user._id });

    // Delete all conversations the user is in
    await Conversation.deleteMany({ participants: user._id });

    // Delete all collages the user has posted
    await Collage.deleteMany({ author: user._id });

    // Delete all camera albums the user has created
    await CameraAlbum.deleteMany({ author: user._id });

    // Delete all camera shots associated with the user
    await CameraShot.deleteMany({ user: user._id });

    // Remove the user from the followers' following field
    await User.updateMany(
      { followers: user._id },
      { $pull: { following: user._id } }
    );

    // Remove the user from the following users' followers field
    await User.updateMany(
      { following: user._id },
      { $pull: { followers: user._id } }
    );

    // Untag the user from all tagged collages
    await Collage.updateMany(
      { tagged: user._id },
      { $pull: { tagged: user._id } }
    );

    // Delete all comments associated with the user and remove them from collages
    await Comment.deleteMany({ author: user._id });

    // Remove the user's comments from all collages
    await Collage.updateMany({}, { $pull: { comments: { author: user._id } } });

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
