import { applyCameraEffects } from "../../../../utils/applyCameraEffects.mjs";
import { CameraShot } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

const editCameraShot = async (_, { shotId, camera }, { user }) => {
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

    // Apply new camera effects
    await applyCameraEffects(shot.image, camera);

    // Update the camera type in the database
    shot.camera = camera;
    await shot.save();

    return shot;
  } catch (error) {
    console.error("Error editing camera shot:", error);
    throw new Error("Failed to edit camera shot.");
  }
};

export default editCameraShot;
