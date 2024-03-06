import { PrivacyGroup } from "../../../../models/index.mjs";
import {
  isUser,
  isCurrentPrivacyGroupAuthor,
} from "../../../../utils/auth.mjs";

const editPrivacyGroup = async (
  _,
  { privacyGroupId, newGroupName },
  { user }
) => {
  try {
    // Check if the user is authenticated
    isUser(user);

    // Check if the user is the author of the PrivacyGroup
    await isCurrentPrivacyGroupAuthor(user, privacyGroupId);

    // Update the PrivacyGroup's groupName using findByIdAndUpdate
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
    throw new Error("An error occurred during privacy group editing.");
  }
};

export default editPrivacyGroup;
