import { CameraAlbum, User } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

const deleteCameraAlbum = async (_, { albumId }, { user }) => {
  try {
    // Ensure the user is authenticated
    isUser(user);

    // Retrieve the album and verify ownership
    const album = await CameraAlbum.findById(albumId);
    if (!album) {
      return { success: false, message: "Camera album not found." };
    }

    if (album.author.toString() !== user.toString()) {
      return {
        success: false,
        message: "You are not authorized to delete this album.",
      };
    }

    // Update the user's cameraAlbums field before deleting the album
    await User.findByIdAndUpdate(user, {
      $pull: { cameraAlbums: albumId },
    });

    // Delete the camera album
    await CameraAlbum.findByIdAndDelete(albumId);

    return { success: true, message: "Camera album deleted successfully." };
  } catch (error) {
    console.error("[deleteCameraAlbum] Error deleting album:", error);
    return { success: false, message: "Failed to delete camera album." };
  }
};

export default deleteCameraAlbum;
