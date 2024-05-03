import { CameraAlbum } from "../../../../models/index.mjs";

const editCameraAlbum = async (
  _,
  { albumId, title, description },
  { user }
) => {
  try {
    const updates = {};
    if (title) updates.title = title;
    if (description) updates.description = description;

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
