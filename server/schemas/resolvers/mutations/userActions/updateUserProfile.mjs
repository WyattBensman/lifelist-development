import { User } from "../../../../models/index.mjs";
import { isCurrentUser } from "../../../../utils/auth.mjs";
import { uploadSingleImage } from "../../../../utils/uploadImages.mjs";

const updateUserProfile = async (
  _,
  { profilePicture, fName, lName, username, bio },
  { user }
) => {
  try {
    // Authenticate
    isUser(user);

    // Validate fName & lName
    if (!fName || !lName) {
      throw new Error("Both first name and last name are required.");
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
      user._id,
      {
        profilePicture: fileUrl,
        fName,
        lName,
        username,
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

export default updateUserProfile;
