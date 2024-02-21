import { CameraAlbum, CameraShot } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

const addShotsToAlbum = async (_, { albumId, shotIds }, { user }) => {
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

    // Check if the shots belong to the user
    const userShots = await CameraShot.find({
      _id: { $in: shotIds },
      author: user.id,
    });

    if (userShots.length !== shotIds.length) {
      throw new Error(
        "One or more shots not found or user does not own the shots."
      );
    }

    // Add the shots to the album
    album.shots = [...new Set([...album.shots, ...shotIds])];
    await album.save();

    return album;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred while adding the shots to the album.");
  }
};

export default addShotsToAlbum;
