import { User } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

const unfollowUser = async (_, { userIdToUnfollow }, { user }) => {
  try {
    isUser(user);

    // Update the user's following list
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { $pull: { following: userIdToUnfollow } },
      { new: true }
    );

    // Update the unfollowed user's followers list
    await User.findByIdAndUpdate(
      userIdToUnfollow,
      { $pull: { followers: user._id } },
      { new: true }
    );

    return {
      success: true,
      message: "User followed successfully.",
      action: "UNFOLLOW",
    };
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred during unfollow action.");
  }
};

export default unfollowUser;
