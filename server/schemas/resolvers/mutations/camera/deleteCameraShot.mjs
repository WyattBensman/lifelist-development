import { CameraShot, User, Collage } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";
import { deleteImageFromS3 } from "../../../../utils/awsHelper.mjs";

const deleteCameraShot = async (_, { shotId }, { user }) => {
  try {
    isUser(user); // Ensure the user is authenticated

    // Retrieve the camera shot from the database
    const shot = await CameraShot.findById(shotId);
    if (!shot) {
      return { success: false, message: "Camera shot not found." };
    }

    // Ensure the user is authorized to delete this shot
    if (shot.author.toString() !== user.toString()) {
      return {
        success: false,
        message: "User not authorized to delete this camera shot.",
      };
    }

    // Check if the shot exists in any of the user's collages
    const isInCollage = await Collage.exists({
      author: user,
      images: shot.image, // Check if the shot's image URL is in the collage's `images` array
    });

    if (isInCollage) {
      // If the shot is in a collage, remove it from the user's cameraRoll but keep the shot
      await User.findByIdAndUpdate(user, {
        $pull: { cameraShots: shotId },
      });

      return {
        success: true,
        message:
          "Shot removed from your camera roll but retained in your collages.",
      };
    }

    // If the shot is not in a collage, proceed to delete it entirely
    // Remove the shot ID from the user's cameraShots field
    await User.findByIdAndUpdate(user, {
      $pull: { cameraShots: shotId },
    });

    // Extract the S3 key from the image URL
    const s3Key = shot.image.split(process.env.CLOUDFRONT_URL)[1].substring(1);

    // Delete the image from S3
    try {
      await deleteImageFromS3(s3Key);
      console.log(
        `[deleteCameraShot] Image ${s3Key} successfully deleted from S3.`
      );
    } catch (s3Error) {
      console.error(
        `[deleteCameraShot] Error deleting image from S3 (${s3Key}): ${s3Error.message}`
      );
    }

    // Delete the camera shot from the database
    await CameraShot.findByIdAndDelete(shotId);

    return { success: true, message: "Camera shot deleted successfully." };
  } catch (error) {
    console.error(`[deleteCameraShot] Error: ${error.message}`);
    return { success: false, message: "Failed to delete camera shot." };
  }
};

export default deleteCameraShot;
