import { CameraAlbum, User } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

const createCameraAlbum = async (_, { title, description }, { user }) => {
  try {
    isUser(user);

    const newAlbum = new CameraAlbum({
      author: user._id,
      title,
      description,
      shots: [],
    });
    await newAlbum.save();

    // Update the User model to include the new album in their cameraAlbums field
    await User.findByIdAndUpdate(user._id, {
      $push: { cameraAlbums: newAlbum._id },
    });

    return newAlbum;
  } catch (error) {
    console.error("Error creating camera album:", error);
    throw new Error("Failed to create camera album.");
  }
};

export default createCameraAlbum;
