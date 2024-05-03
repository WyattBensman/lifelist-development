import { User } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

const unfollowUser = async (_, { userIdToUnfollow }, { user }) => {
  try {
    isUser(user);

    // Removes the user from the current user's following list
    await User.findByIdAndUpdate(
      user._id,
      { $pull: { following: userIdToUnfollow } },
      { new: true }
    );

    // Removes the current user from the unfollowed user's followers list
    await User.findByIdAndUpdate(
      userIdToUnfollow,
      { $pull: { followers: user._id } },
      { new: true }
    );

    return {
      success: true,
      message: "User unfollowed successfully.",
    };
  } catch (error) {
    console.error(`Unfollow User Error: ${error.message}`);
    throw new Error(
      "Unable to complete unfollow action due to a server error."
    );
  }
};

export default unfollowUser;
