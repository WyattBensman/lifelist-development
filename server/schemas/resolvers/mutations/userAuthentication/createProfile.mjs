import { User } from "../../../../models/index.mjs";
import { compressProfilePicture } from "../../../../utils/uploadImages.mjs";
import { generateToken } from "../../../../utils/auth.mjs";

const createProfile = async (
  _,
  {
    fullName,
    bio,
    gender,
    profilePicture,
    username,
    password,
    email,
    phoneNumber,
    birthday,
  }
) => {
  try {
    // Ensure required fields are present
    if (
      !fullName ||
      !username ||
      !password ||
      (!email && !phoneNumber) ||
      !birthday
    ) {
      throw new Error(
        "Required fields are missing. Please fill in all required fields."
      );
    }

    // Re-check username availability
    const existingUsername = await User.findOne({
      username: username.toLowerCase(),
    });
    if (existingUsername) {
      throw new Error("The username is already taken.");
    }

    // Re-check email availability if provided
    if (email) {
      const existingEmail = await User.findOne({ email: email.toLowerCase() });
      if (existingEmail) {
        throw new Error("An account with this email already exists.");
      }
    }

    // Re-check phone number availability if provided
    if (phoneNumber) {
      const existingPhoneNumber = await User.findOne({ phoneNumber });
      if (existingPhoneNumber) {
        throw new Error("An account with this phone number already exists.");
      }
    }

    // Validate age (18+)
    const currentDate = new Date();
    const userBirthday = new Date(birthday);
    let age = currentDate.getFullYear() - userBirthday.getFullYear();
    const m = currentDate.getMonth() - userBirthday.getMonth();
    if (m < 0 || (m === 0 && currentDate.getDate() < userBirthday.getDate())) {
      age--;
    }
    if (age < 18) {
      throw new Error("You must be at least 18 years old to create a profile.");
    }

    // Handle profile picture upload
    let fileUrl = "default-avatar.jpg"; // Default profile picture
    if (profilePicture) {
      const uploadDir = "./uploads";
      const filePath = await compressProfilePicture(
        profilePicture.file,
        uploadDir
      );

      // Construct the file URL
      const baseUrl = process.env.API_URL || "http://localhost:3001";
      fileUrl = `${baseUrl}/uploads/${filePath.split("/").pop()}`;
    }

    // Create the user in the database
    const newUser = await User.create({
      fullName,
      bio,
      gender,
      profilePicture: fileUrl,
      username: username.toLowerCase(),
      password,
      email: email ? email.toLowerCase() : null,
      phoneNumber,
      birthday,
    });

    // Generate a JWT token for the user
    const token = generateToken(newUser._id);

    return {
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        fullName: newUser.fullName,
        profilePicture: newUser.profilePicture,
      },
    };
  } catch (error) {
    console.error(`Create Profile Error: ${error.message}`);
    throw new Error("Profile creation failed. Please try again.");
  }
};

export default createProfile;
