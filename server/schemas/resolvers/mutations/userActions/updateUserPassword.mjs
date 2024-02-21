import { User } from "../../../../models/index.mjs";
import { AuthenticationError, isCurrentUser } from "../../../../utils/auth.mjs";

const updateUserPassword = async (
  _,
  { userId, currentPassword, newPassword },
  { user }
) => {
  try {
    // Check if the user is authenticated & is the current user
    isCurrentUser(user, userId);

    // Fetch the current user data
    const currentUser = await User.findById(userId);

    // Verify the current password
    const isCurrentPasswordValid = await currentUser.isCorrectPassword(
      currentPassword
    );

    if (!isCurrentPasswordValid) {
      throw new AuthenticationError("Invalid current password");
    }

    // Update the user's password directly
    currentUser.password = newPassword;
    const updatedUser = await currentUser.save();

    return updatedUser;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred during password update");
  }
};

export default updateUserPassword;
