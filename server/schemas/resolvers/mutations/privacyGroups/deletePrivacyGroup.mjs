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
    await User.findByIdAndUpdate(user, {
      $pull: { privacyGroups: privacyGroupId },
    });

    return { success: true, message: "Privacy Group deleted successfully." };
  } catch (error) {
    console.error(`Error: ${error.message}`);
    return { success: false, message: "Failed to delete privacy group." };
  }
};

export default deletePrivacyGroup;
