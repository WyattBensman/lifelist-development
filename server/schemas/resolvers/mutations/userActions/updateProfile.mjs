import { User } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";
import { uploadSingleImage } from "../../../../utils/uploadImages.mjs";

const updateProfile = async (
  _,
  { profilePicture, fullName, username, bio },
  { user }
) => {
  try {
    isUser(user);

    // Validate fullName
    if (!fullName) {
      throw new Error("Full name is required.");
    }

    // Validate username
    if (!username) {
      throw new Error("Username is required.");
    }

    // Use the existing profile picture by default
    let fileUrl = user.profilePicture;

    // If a new profilePicture is provided, handle file upload
    if (profilePicture) {
      const uploadDir = "./uploads";
      const filePath = await uploadSingleImage(profilePicture.file, uploadDir);
      const baseUrl = process.env.PORT ? "" : "http://localhost:3001";
      fileUrl = `${baseUrl}/uploads/${filePath.split("/").pop()}`;
    }

    const updatedUser = await User.findByIdAndUpdate(
      user,
      {
        profilePicture: fileUrl,
        fullName,
        username,
        bio,
      },
      { new: true, runValidators: true }
    );

    return {
      profilePicture: updatedUser.profilePicture,
      fullName: updatedUser.fullName,
      username: updatedUser.username,
      bio: updatedUser.bio,
    };
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred during profile update.");
  }
};

export default updateProfile;
