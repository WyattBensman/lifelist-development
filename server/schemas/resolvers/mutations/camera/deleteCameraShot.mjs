import fs from "fs/promises";
import path from "path";
import { CameraShot, CameraAlbum, User } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const deleteCameraShot = async (_, { shotId }, { user }) => {
  try {
    isUser(user);

    // Retrieve the camera shot from the database
    const shot = await CameraShot.findById(shotId);
    if (!shot) {
      return { success: false, message: "Camera shot not found." };
    }

    // Ensure the user is authorized to delete this shot
    if (shot.author.toString() !== user._id.toString()) {
      return {
        success: false,
        message: "User not authorized to delete this camera shot.",
      };
    }

    // Remove the shot ID from any albums it may be part of
    await CameraAlbum.updateMany(
      { shots: shotId },
      { $pull: { shots: shotId } }
    );

    // Remove the shot ID from the user's cameraShots field
    await User.findByIdAndUpdate(user._id, {
      $pull: { cameraShots: shotId },
    });

    // Delete the image file from the filesystem
    /*     const filePath = path.join(__dirname, shot.image);
    try {
      await fs.unlink(filePath);
    } catch (err) {
      console.error("Failed to delete image file:", err);
      throw new Error("Failed to delete image file.");
    } */

    // Delete the camera shot
    await CameraShot.findByIdAndDelete(shotId);

    // Return a success message
    return { success: true, message: "Camera shot deleted successfully." };
  } catch (error) {
    console.error("Error deleting camera shot:", error);
    return { success: false, message: "Failed to delete camera shot." };
  }
};

export default deleteCameraShot;
