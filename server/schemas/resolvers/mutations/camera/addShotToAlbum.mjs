import { CameraAlbum } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

const addShotToAlbum = async (_, { albumId, shotId }, { user }) => {
  try {
    isUser(user);

    const album = await CameraAlbum.findById(albumId);
    if (!album) {
      throw new Error("Camera album not found.");
    }
    if (album.author.toString() !== user._id.toString()) {
      throw new Error("Not authorized to add shots to this album.");
    }

    await CameraAlbum.findByIdAndUpdate(albumId, {
      $addToSet: { shots: shotId },
    });

    return {
      success: true,
      message: "Shot added to album successfully.",
    };
  } catch (error) {
    console.error("Error adding shot to album:", error);
    return {
      success: false,
      message: "Failed to add shot to album.",
    };
  }
};

export default addShotToAlbum;
