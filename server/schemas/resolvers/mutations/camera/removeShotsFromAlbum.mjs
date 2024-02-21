import { CameraAlbum } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

export const removeShotsFromAlbum = async (
  _,
  { albumId, shotIds },
  { user }
) => {
  try {
    isUser(user);

    // Check if the user owns the album
    const album = await CameraAlbum.findOne({
      _id: albumId,
      author: user.id,
    });

    if (!album) {
      throw new Error("Album not found or user does not own the album.");
    }

    // Remove the shots from the album
    album.shots = album.shots.filter((id) => !shotIds.includes(id.toString()));
    await album.save();

    return album;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error(
      "An error occurred while removing the shots from the album."
    );
  }
};
