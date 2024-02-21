import { User } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

export const unblockUser = async (_, { userIdToUnblock }, { user }) => {
  try {
    // Ensure the user is authenticated
    isUser(user);

    // Unblock the user
    const updatedUser = await User.findByIdAndUpdate(
      user.id,
      { $pull: { blocked: userIdToUnblock } },
      { new: true, runValidators: true }
    );

    return updatedUser;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred during user unblocking.");
  }
};
