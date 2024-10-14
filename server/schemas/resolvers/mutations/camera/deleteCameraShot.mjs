import path from "path";
import { CameraShot, CameraAlbum, User } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";
import fs from "fs/promises";
import * as url from "url";

// Define the directory for uploads
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
const uploadDir = path.join(__dirname, "../../../../uploads");

const deleteCameraShot = async (_, { shotId }, { user }) => {
  try {
    isUser(user); // Verify if the user is authenticated

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

    // Remove the shot ID from the user's cameraShots field (assuming it exists in the User schema)
    await User.findByIdAndUpdate(user._id, {
      $pull: { cameraShots: shotId },
    });

    // Extract the image file path (relative to the uploads directory)
    const filePath = path.join(uploadDir, path.basename(shot.image));

    // Delete the file from the file system
    try {
      await fs.unlink(filePath); // Delete the file from the file system
      console.log(`File ${filePath} successfully deleted`);
    } catch (fileError) {
      console.error(`Error deleting file: ${fileError.message}`);
    }

    // Delete the camera shot from the database
    await CameraShot.findByIdAndDelete(shotId);

    // Return a success message
    return { success: true, message: "Camera shot deleted successfully." };
  } catch (error) {
    console.error("Error deleting camera shot:", error);
    return { success: false, message: "Failed to delete camera shot." };
  }
};

export default deleteCameraShot;
