import { User } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";
import { uploadSingleImage } from "../../../../utils/uploadImages.mjs";

const setProfileInformation = async (
  _,
  { profilePicture, bio, fullName, gender },
  { user }
) => {
  isUser(user);

  // Input validation for fullName and gender
  if (!fullName) {
    throw new Error("Full name is required.");
  }
  if (!gender) {
    throw new Error("Gender is required.");
  }

  let fileUrl = user.profilePicture; // Default to the existing profile picture

  try {
    if (profilePicture) {
      // Handle file upload if a new profile picture is provided
      const uploadDir = "./uploads";
      const filePath = await uploadSingleImage(profilePicture.file, uploadDir);
      const baseUrl = process.env.API_URL || "http://localhost:3001";
      fileUrl = `${baseUrl}/uploads/${filePath.split("/").pop()}`;
    }

    // Update the user's profile information
    const updatedUser = await User.findByIdAndUpdate(
      user,
      {
        profilePicture: fileUrl,
        bio,
        fullName,
        gender,
      },
      { new: true, runValidators: true } // Ensure updated document is returned and validators run
    );

    if (!updatedUser) {
      throw new Error("User not found.");
    }

    return {
      success: true,
      message: "Profile information successfully updated.",
      user: updatedUser,
    };
  } catch (error) {
    console.error(`Error updating profile information: ${error.message}`);
    throw new Error("An error occurred during profile information update.");
  }
};

export default setProfileInformation;
