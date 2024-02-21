import { CameraAlbum } from "../../../../models/index.mjs";
import { isUser, isCurrentAuthor } from "../../../../utils/auth.mjs";

const deleteAlbum = async (_, { albumId }, { user }) => {
  try {
    // Check if the user is authenticated
    isUser(user);

    // Find the camera album by ID
    const album = await CameraAlbum.findById(albumId);

    // Check if the album exists
    if (!album) {
      throw new Error("Camera album not found.");
    }

    // Check if the current user is the author of the album
    isCurrentAuthor(user, album.author);

    // Remove the album from the user's cameraAlbums array
    user.cameraAlbums.pull(albumId);

    // Save the user with the updated cameraAlbums array
    await user.save();

    // Delete the camera album
    await album.remove();

    return {
      message: "Camera album deleted successfully.",
    };
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred while deleting the camera album.");
  }
};

export default deleteAlbum;
