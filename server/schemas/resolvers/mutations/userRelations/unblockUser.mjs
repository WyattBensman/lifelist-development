import { User } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

const unblockUser = async (_, { userIdToUnblock }, { user }) => {
  try {
    isUser(user);

    // Attempt to unblock the user by removing them from the blocked list
    await User.findByIdAndUpdate(
      user._id,
      { $pull: { blocked: userIdToUnblock } },
      { new: true, runValidators: true }
    );

    return {
      success: true,
      message: "User successfully unblocked.",
    };
  } catch (error) {
    console.error(`Unblock User Error: ${error.message}`);
    throw new Error("Unable to complete unblock action due to a server error.");
  }
};

export default unblockUser;
