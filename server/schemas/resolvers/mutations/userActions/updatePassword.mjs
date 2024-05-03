import { User } from "../../../../models/index.mjs";
import { AuthenticationError, isUser } from "../../../../utils/auth.mjs";

const updatePassword = async (
  _,
  { currentPassword, newPassword },
  { user }
) => {
  try {
    isUser(user);

    // Fetch the current user data
    const currentUser = await User.findById(user._id);
    if (!currentUser) {
      throw new AuthenticationError("User not found.");
    }

    // Verify the current password
    const isCurrentPasswordValid = await currentUser.isCorrectPassword(
      currentPassword
    );
    if (!isCurrentPasswordValid) {
      throw new AuthenticationError("Invalid current password.");
    }

    // Ensure the new password is different from the current password (if necessary)
    if (currentPassword === newPassword) {
      throw new AuthenticationError(
        "New password must be different from the current password."
      );
    }

    // Update the user's password directly
    currentUser.password = newPassword;
    await currentUser.save();

    return {
      success: true,
      message: "Password successfully updated.",
    };
  } catch (error) {
    console.error(`Update Password Error: ${error.message}`);
    throw new AuthenticationError(
      "Failed to update password. Please try again."
    );
  }
};

export default updatePassword;
