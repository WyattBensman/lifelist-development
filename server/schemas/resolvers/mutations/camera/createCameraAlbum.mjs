import { CameraAlbum, User } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

const createCameraAlbum = async (
  _,
  { title, shots, shotsCount, coverImage },
  { user }
) => {
  try {
    isUser(user);

    const newAlbum = new CameraAlbum({
      author: user,
      title,
      shots,
      shotsCount,
      coverImage,
    });

    await newAlbum.save();

    // Update the User model to include the new album in their cameraAlbums field
    await User.findByIdAndUpdate(user, {
      $push: { cameraAlbums: newAlbum._id },
    });

    return {
      success: true,
      message: "Camera album created successfully.",
      albumId: newAlbum._id, // Rename `_id` to `albumId`
    };
  } catch (error) {
    console.error("Error creating camera album:", error);
    return {
      success: false,
      message: "Failed to create camera album.",
      albumId: null, // Use `albumId` instead of `_id`
    };
  }
};

export default createCameraAlbum;
