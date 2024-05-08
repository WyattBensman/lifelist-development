import { CameraAlbum } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

const addShotsToAlbum = async (_, { albumId, shotIds }, { user }) => {
  try {
    isUser(user);

    // Fetch the album and ensure it exists and belongs to the user
    const album = await CameraAlbum.findById(albumId);
    if (!album) {
      throw new Error("Camera album not found.");
    }
    if (album.author.toString() !== user._id.toString()) {
      throw new Error("Not authorized to add shots to this album.");
    }

    // Add new shot IDs to the album's shots array using $addToSet to prevent duplicates
    const updatedAlbum = await CameraAlbum.findByIdAndUpdate(
      albumId,
      {
        $addToSet: { shots: { $each: shotIds } },
      },
      { new: true }
    ).populate("shots");

    return updatedAlbum;
  } catch (error) {
    console.error("Error adding shots to album:", error);
    throw new Error("Failed to add shots to album.");
  }
};

export default addShotsToAlbum;
