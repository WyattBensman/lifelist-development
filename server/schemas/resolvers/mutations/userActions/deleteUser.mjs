import { User } from "../../../../models/index.mjs";
import { isCurrentUser } from "../../../../utils/auth.mjs";

export const deleteUser = async (_, { userId }, { user }) => {
  try {
    // Authenticate
    isCurrentUser(user, userId);

    // Find the user to delete
    const userToDelete = await User.findById(userId);

    // Check if the user exists
    if (!userToDelete) {
      throw new Error("User not found.");
    }

    // Delete the user
    await userToDelete.remove();

    return {
      message: `User ${userToDelete.id} deleted successfully.`,
    };
  } catch (error) {
    console.error(`Error during user deletion: ${error.message}`);
    throw new Error("An error occurred during user deletion.");
  }
};
