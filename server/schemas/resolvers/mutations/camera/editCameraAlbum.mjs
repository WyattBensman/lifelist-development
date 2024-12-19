import { CameraAlbum } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

const editCameraAlbum = async (_, { albumId, title }, { user }) => {
  try {
    isUser(user);

    const updates = {};
    if (title) updates.title = title;

    const updatedAlbum = await CameraAlbum.findByIdAndUpdate(albumId, updates, {
      new: true,
    });
    if (!updatedAlbum) {
      throw new Error("Camera album not found.");
    }

    return updatedAlbum;
  } catch (error) {
    console.error("Error editing camera album:", error);
    throw new Error("Failed to edit camera album.");
  }
};

export default editCameraAlbum;
