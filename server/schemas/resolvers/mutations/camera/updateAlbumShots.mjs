import { CameraAlbum, CameraShot } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

const updateAlbumShots = async (_, { albumId, shotIds }, { user }) => {
  try {
    isUser(user);

    // Fetch the CameraShot documents for the given shotIds
    const cameraShots = await CameraShot.find({ _id: { $in: shotIds } });

    // Update the CameraAlbum with the fetched CameraShot documents
    const updatedAlbum = await CameraAlbum.findByIdAndUpdate(
      albumId,
      { shots: cameraShots },
      { new: true }
    );

    return {
      success: true,
      message: "Album shots updated successfully",
    };
  } catch (error) {
    console.error(`Error updating shots to CameraAlbum: ${error.message}`);
    throw new Error("Failed to update shots in CameraAlbum.");
  }
};

export default updateAlbumShots;
