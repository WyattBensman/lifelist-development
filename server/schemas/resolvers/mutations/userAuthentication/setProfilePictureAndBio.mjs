import { User } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";
import { uploadSingleImage } from "../../../../utils/uploadImages.mjs";

const setProfilePictureAndBio = async (
  _,
  { profilePicture, bio },
  { user }
) => {
  isUser(user);

  try {
    let fileUrl = user.profilePicture; // Default to the existing profile picture

    if (profilePicture) {
      // Use uploadSingleImage Util to handle file upload
      const uploadDir = "./uploads";
      const filePath = await uploadSingleImage(profilePicture.file, uploadDir);

      // Construct the file URL
      const baseUrl = process.env.API_URL || "http://localhost:3001"; // Adjust according to your environment variable
      fileUrl = `${baseUrl}/uploads/${filePath.split("/").pop()}`;
    }

    // Update the user's profile picture and bio
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { profilePicture: fileUrl, bio },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      throw new Error("User not found.");
    }

    return {
      success: true,
      message: "Profile picture and bio successfully updated.",
      user: updatedUser,
    };
  } catch (error) {
    console.error(`Error updating profile: ${error.message}`);
    throw new Error("An error occurred during profile update.");
  }
};

export default setProfilePictureAndBio;
