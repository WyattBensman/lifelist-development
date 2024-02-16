import { User } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

export const blockUser = async (_, { userIdToBlock }, { user }) => {
  try {
    // Ensure the user is authenticated
    isUser(user);

    // Block the user
    const updatedUser = await User.findByIdAndUpdate(
      user.id,
      { $push: { blocked: userIdToBlock } },
      { new: true, runValidators: true }
    );

    return {
      message: "User blocked successfully.",
    };
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred during user blocking.");
  }
};
