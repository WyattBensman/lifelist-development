import {
  Collage,
  User,
  Comment,
  Notification,
  CameraShot,
} from "../../../../models/index.mjs";
import { isUser, isCurrentAuthor } from "../../../../utils/auth.mjs";
import { deleteImageFromS3 } from "../../../../utils/awsHelper.mjs";

const deleteCollage = async (_, { collageId }, { user }) => {
  try {
    isUser(user); // Ensure the user is authenticated

    // Ensure the collage exists and the user is its author
    await isCurrentAuthor(user, collageId);

    // Retrieve the collage
    const collage = await Collage.findById(collageId);
    if (!collage) {
      throw new Error("Collage not found.");
    }

    // Process each image in the collage
    for (const imageUrl of collage.images) {
      try {
        // Find the associated CameraShot
        const cameraShot = await CameraShot.findOne({ image: imageUrl });

        if (cameraShot) {
          // Check if the image is in the user's cameraRoll
          const isInCameraRoll = await User.exists({
            _id: user,
            cameraShots: cameraShot._id,
          });

          // Check if the image is referenced in other collages
          const isInOtherCollages = await Collage.exists({
            _id: { $ne: collageId }, // Exclude the current collage
            images: imageUrl,
          });

          // If not in cameraRoll or other collages, delete from S3
          if (!isInCameraRoll && !isInOtherCollages) {
            const s3Key = imageUrl
              .split(process.env.CLOUDFRONT_URL)[1]
              ?.substring(1);

            if (s3Key) {
              try {
                await deleteImageFromS3(s3Key);
                console.log(`[deleteCollage] Deleted image from S3: ${s3Key}`);
              } catch (s3Error) {
                console.error(
                  `[deleteCollage] Error deleting image from S3 (${s3Key}): ${s3Error.message}`
                );
              }
            } else {
              console.warn(
                `[deleteCollage] Unable to extract S3 key for image: ${imageUrl}`
              );
            }
          }
        }
      } catch (imageError) {
        console.error(
          `[deleteCollage] Error processing image (${imageUrl}): ${imageError.message}`
        );
      }
    }

    // Remove the collage from all users' lists and related data
    await User.updateMany(
      {},
      {
        $pull: {
          savedCollages: collageId,
          likedCollages: collageId,
          repostedCollages: collageId,
          collages: collageId,
          taggedCollages: collageId,
        },
      }
    );

    // Delete all comments associated with the collage
    await Comment.deleteMany({ collage: collageId });

    // Delete all notifications related to the collage
    await Notification.deleteMany({ collage: collageId });

    // Finally, delete the collage itself
    await Collage.findByIdAndDelete(collageId);

    return {
      success: true,
      message: "Collage successfully deleted. Unused images removed from S3.",
      action: "DELETE_COLLAGE",
    };
  } catch (error) {
    console.error(`[deleteCollage] Error: ${error.message}`);
    throw new Error("An error occurred during collage deletion.");
  }
};

export default deleteCollage;
