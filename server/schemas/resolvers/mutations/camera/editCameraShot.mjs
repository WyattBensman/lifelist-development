import { CameraShot } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

const editCameraShot = async (_, { shotId, image }, { user }) => {
  try {
    isUser(user);

    const shot = await CameraShot.findById(shotId);
    if (!shot) {
      throw new Error("Camera shot not found.");
    }

    // Check if the logged-in user is the author of the camera shot
    if (shot.author.toString() !== user._id.toString()) {
      throw new Error("User not authorized to edit this camera shot.");
    }

    // Update the image in the database
    shot.image = image;
    await shot.save();

    return {
      success: true,
      message: "Camera shot updated successfully.",
    };
  } catch (error) {
    console.error("Error editing camera shot:", error);
    throw new Error("Failed to edit camera shot.");
  }
};

export default editCameraShot;
