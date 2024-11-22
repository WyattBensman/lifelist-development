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
import { deleteImageFromS3 } from "../../../../utils/awsHelper.mjs";

const deleteUser = async (_, __, { user }) => {
  try {
    isUser(user);

    // Find the user to delete
    const userToDelete = await User.findById(user);
    if (!userToDelete) {
      console.error(`[deleteUser] User not found.`);
      throw new Error("User not found.");
    }

    console.log(`[deleteUser] Starting deletion for user: ${userToDelete.id}`);

    // Helper function to delete images from S3
    const deleteS3Image = async (imageUrl) => {
      try {
        const s3Key = imageUrl
          .split(process.env.CLOUDFRONT_URL)[1]
          ?.substring(1);
        if (s3Key) {
          await deleteImageFromS3(s3Key);
          console.log(`[deleteUser] Deleted image from S3: ${s3Key}`);
        } else {
          console.warn(
            `[deleteUser] Invalid S3 key extraction for image: ${imageUrl}`
          );
        }
      } catch (s3Error) {
        console.error(
          `[deleteUser] Error deleting image from S3: ${s3Error.message}`
        );
      }
    };

    // Delete the user's profile picture if it's not the default avatar
    if (
      userToDelete.profilePicture &&
      !userToDelete.profilePicture.includes("default-avatar.jpg")
    ) {
      await deleteS3Image(userToDelete.profilePicture);
    }

    // Delete all associated CameraShots and images
    const userShots = await CameraShot.find({ author: user });
    for (const shot of userShots) {
      await deleteS3Image(shot.image);
      await CameraShot.findByIdAndDelete(shot._id);
    }

    // Delete all collages and their images
    const userCollages = await Collage.find({ author: user });
    for (const collage of userCollages) {
      for (const imageUrl of collage.images) {
        await deleteS3Image(imageUrl);
      }
      await Collage.findByIdAndDelete(collage._id);
    }

    console.log(
      `[deleteUser] Deleted all CameraShots and Collages for user: ${userToDelete.id}`
    );

    // Delete user-related data
    await LifeList.deleteOne({ author: user });
    await PrivacyGroup.deleteMany({ author: user });
    await Message.deleteMany({ sender: user });
    await Conversation.deleteMany({ participants: user });
    await CameraAlbum.deleteMany({ author: user });

    // Remove the user from followers' following field and vice versa
    await User.updateMany({ followers: user }, { $pull: { following: user } });
    await User.updateMany({ following: user }, { $pull: { followers: user } });

    // Untag the user from all tagged collages
    await Collage.updateMany({ tagged: user }, { $pull: { tagged: user } });

    // Delete all comments authored by the user and remove references from collages
    await Comment.deleteMany({ author: user });
    await Collage.updateMany({}, { $pull: { comments: { author: user } } });

    // Delete the user
    await User.findByIdAndDelete(user);

    console.log(`[deleteUser] Successfully deleted user: ${userToDelete.id}`);

    return {
      success: true,
      message: `User ${userToDelete.id} deleted successfully.`,
    };
  } catch (error) {
    console.error(`[deleteUser] Error during user deletion: ${error.message}`);
    throw new Error("An error occurred during user deletion.");
  }
};

export default deleteUser;
