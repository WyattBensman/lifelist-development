import { CameraAlbum } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

const removeShotFromAlbum = async (_, { albumId, shotId }, { user }) => {
  try {
    isUser(user);

    const album = await CameraAlbum.findById(albumId);
    if (!album) {
      throw new Error("Camera album not found.");
    }
    if (album.author.toString() !== user._id.toString()) {
      throw new Error("Not authorized to remove shots from this album.");
    }

    await CameraAlbum.findByIdAndUpdate(albumId, {
      $pull: { shots: shotId },
    });

    return {
      success: true,
      message: "Shot removed from album successfully.",
    };
  } catch (error) {
    console.error("Error removing shot from album:", error);
    return {
      success: false,
      message: "Failed to remove shot from album.",
    };
  }
};

export default removeShotFromAlbum;
