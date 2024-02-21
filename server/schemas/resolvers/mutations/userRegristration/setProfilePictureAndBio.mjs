import { User } from "../../../../models/index.mjs";
import { uploadSingleImage } from "../../../../utils/uploadImages.mjs";

export const setProfilePictureAndBio = async (
  _,
  { userId, profilePicture, bio }
) => {
  try {
    let fileUrl = null;

    if (profilePicture) {
      // Use uploadSingleImage Util to handle file upload
      const uploadDir = "./uploads";
      const filePath = await uploadSingleImage(profilePicture.file, uploadDir);

      // Construct the file URL
      const baseUrl = process.env.PORT ? "" : "http://localhost:3001";
      fileUrl = `${baseUrl}/uploads/${filePath.split("/").pop()}`;
    }

    // Update the user's profile picture and bio
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        profilePicture: fileUrl,
        bio,
      },
      { new: true, runValidators: true }
    );

    return updatedUser;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred during profile update.");
  }
};
