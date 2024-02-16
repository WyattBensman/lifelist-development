import { User } from "../../../../models/index.mjs";
import { AuthenticationError } from "../../../../utils/auth.mjs";

export const deleteUser = async (_, { userId }, { user }) => {
  try {
    if (!user) {
      throw new AuthenticationError({ message: "User not authenticated" });
    }

    if (user.id !== userId) {
      throw new AuthenticationError({
        message: "Not authorized to delete this user",
      });
    }

    // Find the
    const userToDelete = await User.findById(userId);

    // Check if the user exists
    if (!userToDelete) {
      throw new Error("User not found.");
    }

    // Delete the user
    await userToDelete.remove();

    return {
      message: "User deleted successfully.",
    };
  } catch (error) {
    console.error(`Error during user deletion: ${error.message}`);
    throw new Error("An error occurred during user deletion.");
  }
};
