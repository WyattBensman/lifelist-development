import { User } from "../../../../models/index.mjs";
import { isUser, AuthenticationError } from "../../../../utils/auth.mjs";
import { uploadSingleImage } from "../../../../utils/uploadImages.mjs";

const updateUserData = async (
  _,
  {
    email,
    currentPassword,
    newPassword,
    phoneNumber,
    profilePicture,
    fullName,
    username,
    bio,
    gender,
    birthday,
    isProfilePrivate,
    darkMode,
    language,
    notifications,
    postRepostToMainFeed,
  },
  { user }
) => {
  try {
    isUser(user); // Ensure the user is authenticated

    const updates = {}; // Collect updates for the user document

    // Email update
    if (email) {
      updates.email = email;
    }

    // Password update
    if (currentPassword && newPassword) {
      const currentUser = await User.findById(user);
      if (!currentUser) {
        throw new AuthenticationError("User not found.");
      }

      // Verify current password
      const isCurrentPasswordValid = await currentUser.isCorrectPassword(
        currentPassword
      );
      if (!isCurrentPasswordValid) {
        throw new AuthenticationError("Invalid current password.");
      }

      // Ensure new password is different
      if (currentPassword === newPassword) {
        throw new AuthenticationError(
          "New password must be different from the current password."
        );
      }

      currentUser.password = newPassword;
      await currentUser.save(); // Save the updated password directly
    }

    // Phone number update
    if (phoneNumber) {
      updates.phoneNumber = phoneNumber;
    }

    // Profile updates
    if (fullName) updates.fullName = fullName;
    if (username) updates.username = username;
    if (bio) updates.bio = bio;

    if (profilePicture) {
      const uploadDir = "./uploads";
      const filePath = await uploadSingleImage(profilePicture.file, uploadDir);
      const baseUrl = process.env.PORT ? "" : "http://localhost:3001";
      updates.profilePicture = `${baseUrl}/uploads/${filePath
        .split("/")
        .pop()}`;
    }

    // Identity updates
    if (gender) updates.gender = gender;
    if (birthday) updates.birthday = birthday;

    // Settings updates
    const settingsUpdates = {};
    if (isProfilePrivate !== undefined)
      settingsUpdates.isProfilePrivate = isProfilePrivate;
    if (darkMode !== undefined) settingsUpdates.darkMode = darkMode;
    if (language) settingsUpdates.language = language;
    if (notifications !== undefined)
      settingsUpdates.notifications = notifications;
    if (postRepostToMainFeed !== undefined)
      settingsUpdates.postRepostToMainFeed = postRepostToMainFeed;

    if (Object.keys(settingsUpdates).length > 0) {
      updates.settings = settingsUpdates;
    }

    // Perform the update
    const updatedUser = await User.findByIdAndUpdate(user, updates, {
      new: true,
      runValidators: true,
    });

    return {
      success: true,
      message: "User data updated successfully.",
      user: updatedUser,
    };
  } catch (error) {
    console.error(`Update User Data Error: ${error.message}`);
    throw new Error("An error occurred during the user data update.");
  }
};

export default updateUserData;
