import { User } from "../../../../models/index.mjs";
import { isUser, AuthenticationError } from "../../../../utils/auth.mjs";
import {
  uploadProfileImageToS3,
  deleteOldProfilePicture,
  fetchS3ImageStream,
} from "../../../../utils/awsHelper.mjs";
import { CameraShot } from "../../../../models/index.mjs";

const updateUserData = async (
  _,
  {
    email,
    currentPassword,
    newPassword,
    phoneNumber,
    profilePicture, // CameraShot ID or a new file
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
    const settingsUpdates = {}; // Collect updates for user settings

    // Find the current user
    const currentUser = await User.findById(user);
    if (!currentUser) {
      throw new AuthenticationError("User not found.");
    }

    // Handle profile picture updates
    if (profilePicture) {
      let newProfilePictureUrl;

      if (typeof profilePicture === "string") {
        // Scenario 1: CameraShot ID
        const cameraShot = await CameraShot.findById(profilePicture);
        if (!cameraShot || cameraShot.author.toString() !== user) {
          throw new Error(
            "Invalid CameraShot ID or unauthorized access to the image."
          );
        }

        // Fetch the image stream from S3 and upload as a profile picture
        newProfilePictureUrl = await uploadProfileImageToS3({
          createReadStream: () => fetchS3ImageStream(cameraShot.image),
          filename: `cropped-${cameraShot._id}.jpg`,
        });
      } else if (profilePicture.file) {
        // Scenario 2: File upload
        const { createReadStream, filename } = await profilePicture.file;
        newProfilePictureUrl = await uploadProfileImageToS3({
          createReadStream,
          filename,
        });
      } else {
        throw new Error(
          "Invalid profilePicture input. Must be a CameraShot ID or a file upload."
        );
      }

      // Delete the old profile picture (if not default)
      await deleteOldProfilePicture(currentUser.profilePicture);

      // Update profile picture
      updates.profilePicture = newProfilePictureUrl;
    }

    // Handle other user data updates
    if (email) updates.email = email.toLowerCase();
    if (phoneNumber) updates.phoneNumber = phoneNumber;
    if (fullName) updates.fullName = fullName.trim();
    if (username) updates.username = username.toLowerCase().trim();
    if (bio) updates.bio = bio.trim();
    if (gender) updates.gender = gender;
    if (birthday) updates.birthday = birthday;

    // Handle user settings updates
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
    console.error(`[UpdateUserData] Error: ${error.message}`);
    throw new Error("An error occurred during the user data update.");
  }
};

export default updateUserData;
