import { CameraAlbum, User } from "../../../../models/index.mjs";

const createCameraAlbum = async (
  _,
  { authorId, title, description },
  { user }
) => {
  try {
    const newAlbum = new CameraAlbum({
      author: authorId,
      title,
      description,
      shots: [], // Initialize with an empty array
    });
    await newAlbum.save();

    // Update the User model to include the new album in their cameraAlbums field
    await User.findByIdAndUpdate(authorId, {
      $push: { cameraAlbums: newAlbum._id },
    });

    return newAlbum;
  } catch (error) {
    console.error("Error creating camera album:", error);
    throw new Error("Failed to create camera album.");
  }
};

export default createCameraAlbum;
