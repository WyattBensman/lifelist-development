import { User } from "../../../../models/index.mjs";
import { generateToken } from "../../../../utils/auth.mjs";
import { uploadProfileImageToS3 } from "../../../../utils/awsHelper.mjs";

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

    // Handle profile picture upload to S3
    let fileUrl = `${process.env.CLOUDFRONT_URL}/profile-images/default-avatar.jpg`; // Default profile picture
    if (profilePicture) {
      try {
        const { createReadStream, filename } = await profilePicture.file;
        fileUrl = await uploadProfileImageToS3({ createReadStream, filename });
      } catch (uploadError) {
        console.error(
          `Error uploading profile picture: ${uploadError.message}`
        );
        throw new Error("Failed to upload profile picture. Please try again.");
      }
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
      user: newUser,
    };
  } catch (error) {
    console.error(`Create Profile Error: ${error.message}`);
    throw new Error("Profile creation failed. Please try again.");
  }
};

export default createProfile;
