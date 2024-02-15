import { User } from "../../../../models/index.mjs";

export const deleteUser = async (_, { userId }, { user }) => {
  if (!user) {
    throw new AuthenticationError();
  }

  if (user.id !== userId) {
    throw new AuthenticationError();
  }

  try {
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
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred during user deletion.");
  }
};
