import { User, PrivacyGroup } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

const deletePrivacyGroup = async (_, { privacyGroupId }, { user }) => {
  try {
    isUser(user);

    // Remove the PrivacyGroup by ID
    const deletedPrivacyGroup = await PrivacyGroup.findByIdAndDelete(
      privacyGroupId
    );
    if (!deletedPrivacyGroup) {
      throw new Error(`PrivacyGroup with ID ${privacyGroupId} not found.`);
    }

    // Update user to remove reference to the deleted PrivacyGroup
    await User.findByIdAndUpdate(user._id, {
      $pull: { privacyGroups: privacyGroupId },
    });

    // Return updated list of privacy groups
    return await User.findById(user._id).populate("privacyGroups");
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("Failed to delete privacy group.");
  }
};

export default deletePrivacyGroup;
