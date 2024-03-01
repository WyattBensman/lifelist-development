import { User } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

const blockUser = async (_, { userIdToBlock }, { user }) => {
  try {
    // Ensure the user is authenticated
    isUser(user);

    // Check if the user is already blocked
    const existingBlockedUser = await User.findOne({
      _id: user._id,
      "settings.blocked": userIdToBlock,
    });

    if (existingBlockedUser) {
      return {
        success: false,
        message: "User is already blocked.",
      };
    }

    // Block the user
    const updatedUser = await User.findByIdAndUpdate(
      user_id,
      {
        $push: { "settings.blocked": userIdToBlock },
        $pull: { followers: userIdToBlock, following: userIdToBlock },
      },
      { new: true, runValidators: true }
    );

    // Unfollow the blocked user
    await User.findByIdAndUpdate(
      userIdToBlock,
      {
        $pull: {
          followers: user_id,
          following: user_id,
        },
      },
      { new: true, runValidators: true }
    );

    return {
      success: true,
      message: "User blocked successfully.",
      action: "BLOCK",
    };
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred during user blocking.");
  }
};

export default blockUser;
