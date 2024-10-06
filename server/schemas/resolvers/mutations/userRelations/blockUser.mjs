import { User } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

const blockUser = async (_, { userIdToBlock }, { user }) => {
  try {
    isUser(user);

    // Check if the user is already blocked
    const isAlreadyBlocked = await User.exists({
      _id: user,
      blocked: userIdToBlock,
    });

    if (isAlreadyBlocked) {
      return {
        success: false,
        message: "User is already blocked.",
      };
    }

    // Updates to block the user and remove from followers and following lists
    await User.findByIdAndUpdate(
      user,
      {
        $push: { blocked: userIdToBlock },
        $pull: { followers: userIdToBlock, following: userIdToBlock },
      },
      { new: true, runValidators: true }
    );

    // Ensure mutual unfollowing
    await User.findByIdAndUpdate(
      userIdToBlock,
      {
        $pull: {
          followers: user,
          following: user,
        },
      },
      { new: true, runValidators: true }
    );

    return {
      success: true,
      message: "User successfully blocked.",
    };
  } catch (error) {
    console.error(`Block User Error: ${error.message}`);
    throw new Error("Unable to complete block action due to a server error.");
  }
};

export default blockUser;
