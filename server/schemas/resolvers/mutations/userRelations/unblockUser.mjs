import { User } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

const unblockUser = async (_, { userIdToUnblock }, { user }) => {
  try {
    isUser(user);

    // Unblock the user
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { $pull: { blocked: userIdToUnblock } },
      { new: true, runValidators: true }
    );

    return {
      success: true,
      message: "User unblocked successfully.",
      action: "UNBLOCK",
    };
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred during user unblocking.");
  }
};

export default unblockUser;
