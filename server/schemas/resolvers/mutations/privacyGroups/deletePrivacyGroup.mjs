import { User, PrivacyGroup } from "../../../../models/index.mjs";
import {
  isUser,
  isCurrentPrivacyGroupAuthor,
} from "../../../../utils/auth.mjs";

const deletePrivacyGroup = async (_, { privacyGroupId }, { user }) => {
  try {
    // Check if the user is authenticated
    isUser(user);

    // Check if the user is the author of the PrivacyGroup
    await isCurrentPrivacyGroupAuthor(user, privacyGroupId);

    // Find and remove the PrivacyGroup by ID
    const deletedPrivacyGroup = await PrivacyGroup.findByIdAndDelete(
      privacyGroupId
    );

    if (!deletedPrivacyGroup) {
      throw new Error(`Privacy Group not found.`);
    }

    // Remove the deleted PrivacyGroup from the user's privacyGroups field
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { $pull: { privacyGroups: privacyGroupId } },
      { new: true }
    ).populate({
      path: "privacyGroups",
      populate: {
        path: "users",
        model: "User",
      },
    });

    return updatedUser.privacyGroups;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred during privacy group deletion.");
  }
};

export default deletePrivacyGroup;
