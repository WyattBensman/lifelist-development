import { User } from "../../../../models/index.mjs";
import { AuthenticationError, isCurrentUser } from "../../../../utils/auth.mjs";

const updateUserPassword = async (
  _,
  { currentPassword, newPassword },
  { user }
) => {
  try {
    // Authenticate
    isUser(user);

    // Fetch the current user data
    const currentUser = await User.findById(user._id);

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
