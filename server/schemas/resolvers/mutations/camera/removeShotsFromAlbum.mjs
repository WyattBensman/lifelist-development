import { CameraAlbum } from "../../../../models/index.mjs";

const removeShotsFromAlbum = async (_, { albumId, shotIds }, { user }) => {
  try {
    // Fetch the album and ensure it exists and belongs to the user
    const album = await CameraAlbum.findById(albumId);
    if (!album) {
      throw new Error("Camera album not found.");
    }
    if (album.author.toString() !== user._id.toString()) {
      throw new Error("Not authorized to remove shots from this album.");
    }

    // Remove shot IDs from the album's shots array
    const updatedAlbum = await CameraAlbum.findByIdAndUpdate(
      albumId,
      {
        $pullAll: { shots: shotIds },
      },
      { new: true }
    ).populate("shots"); // Optionally populate 'shots' to return detailed info

    return updatedAlbum;
  } catch (error) {
    console.error("Error removing shots from album:", error);
    throw new Error("Failed to remove shots from album.");
  }
};

export default removeShotsFromAlbum;
