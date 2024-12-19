import { CameraShot, User } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

const getAndTransferCameraShot = async (_, { shotId }, { user }) => {
  try {
    // Authenticate the user
    isUser(user);

    // Fetch the camera shot and its relevant data
    const cameraShot = await CameraShot.findById(shotId)
      .select("_id image isDeveloped transferredToRoll") // Select only necessary fields
      .exec();

    if (!cameraShot) throw new Error("Camera shot not found.");

    if (!cameraShot.transferredToRoll) {
      // Update the user's data by transferring the shot
      await User.findByIdAndUpdate(user, {
        $pull: { developingCameraShots: shotId },
        $addToSet: { cameraShots: shotId },
      });

      // Mark the shot as transferred
      cameraShot.transferredToRoll = true;
      cameraShot.isDeveloped = true;
      await cameraShot.save();
    }

    // Return the camera shot details along with transfer success information
    return {
      success: true,
      message: "Camera shot transferred to camera shots.",
      cameraShot: {
        _id: cameraShot._id,
        imageThumbnail: cameraShot.imageThumbnail,
        image: cameraShot.image,
        capturedAt: cameraShot.capturedAt,
      },
    };
  } catch (error) {
    console.error(`Error in getAndTransferCameraShot: ${error.message}`);
    throw new Error("Failed to fetch or transfer the camera shot.");
  }
};

export default getAndTransferCameraShot;
