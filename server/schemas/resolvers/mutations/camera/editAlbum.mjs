import { CameraAlbum } from "../../../../models/index.mjs";
import { isUser, isCurrentAuthor } from "../../../../utils/auth.mjs";

const editAlbum = async (_, { albumId, title, description }, { user }) => {
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

    // Update the album with new data
    album.title = title || album.title;
    album.description = description || album.description;

    // Save the updated album
    await album.save();

    return album;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred while updating the camera album.");
  }
};

export default editAlbum;
