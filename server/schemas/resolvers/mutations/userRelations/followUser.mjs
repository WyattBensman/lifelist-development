import { User } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

const followUser = async (_, { userIdToFollow }, { user }) => {
  try {
    isUser(user);

    // Update the user's following list
    const updatedUser = await User.findByIdAndUpdate(
      user.id,
      { $addToSet: { following: userIdToFollow } },
      { new: true }
    );

    // Update the followed user's followers list
    await User.findByIdAndUpdate(
      userIdToFollow,
      { $addToSet: { followers: user.id } },
      { new: true }
    );

    return updatedUser;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred during follow action.");
  }
};

export default followUser;
