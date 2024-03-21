import { User, PrivacyGroup } from "../../../../models/index.mjs";
import {
  isUser,
  isCurrentPrivacyGroupAuthor,
} from "../../../../utils/auth.mjs";

const deletePrivacyGroup = async (_, { privacyGroupId }, { user }) => {
  try {
    isUser(user);
    await isCurrentPrivacyGroupAuthor(user, privacyGroupId);

    // Find and remove the PrivacyGroup by ID
    const deletedPrivacyGroup = await PrivacyGroup.findByIdAndDelete(
      privacyGroupId
    );

    if (!deletedPrivacyGroup) {
      throw new Error(`PrivacyGroup with ID ${privacyGroupId} not found.`);
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
