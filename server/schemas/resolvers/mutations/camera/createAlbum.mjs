import { CameraAlbum } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

const createAlbum = async (_, { title, description }, { user }) => {
  try {
    // Check if the user is authenticated
    isUser(user);

    // Create a new camera album
    const newAlbum = await CameraAlbum.create({
      author: user.id,
      title,
      description,
    });

    // Add the album's _id to the user's cameraAlbums array
    user.cameraAlbums.push(newAlbum._id);

    // Save the user with the updated cameraAlbums array
    await user.save();

    return newAlbum;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred while creating the camera album.");
  }
};

export default createAlbum;
