import { PrivacyGroup } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

const editPrivacyGroup = async (
  _,
  { privacyGroupId, newGroupName },
  { user }
) => {
  try {
    isUser(user);

    // Update the groupName of the specified PrivacyGroup
    const updatedPrivacyGroup = await PrivacyGroup.findByIdAndUpdate(
      privacyGroupId,
      { $set: { groupName: newGroupName } },
      { new: true }
    ).populate("users");

    if (!updatedPrivacyGroup) {
      throw new Error(`PrivacyGroup with ID ${privacyGroupId} not found.`);
    }

    return updatedPrivacyGroup;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("Failed to edit privacy group.");
  }
};

export default editPrivacyGroup;
