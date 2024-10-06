import { CameraAlbum, User } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

const deleteCameraAlbum = async (_, { albumId }, { user }) => {
  try {
    isUser(user);

    // Retrieve the album from the database
    const album = await CameraAlbum.findById(albumId);
    if (!album) {
      return { success: false, message: "Camera album not found." };
    }

    // Ensure the user is authorized to delete this album
    if (album.author.toString() !== user.toString()) {
      return {
        success: false,
        message: "User not authorized to delete this camera album.",
      };
    }

    // Delete the camera album
    await CameraAlbum.findByIdAndDelete(albumId);

    // Additionally, remove this album from the user's cameraAlbums field
    await User.findByIdAndUpdate(user, {
      $pull: { cameraAlbums: albumId },
    });

    return { success: true, message: "Camera album deleted successfully." };
  } catch (error) {
    console.error("Error deleting camera album:", error);
    return { success: false, message: "Failed to delete camera album." };
  }
};

export default deleteCameraAlbum;
