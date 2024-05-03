import { PrivacyGroup } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

const addUsersToPrivacyGroup = async (
  _,
  { privacyGroupId, userIds },
  { user }
) => {
  try {
    isUser(user);

    // Update PrivacyGroup to include new users
    const updatedPrivacyGroup = await PrivacyGroup.findByIdAndUpdate(
      privacyGroupId,
      { $addToSet: { users: { $each: userIds } } },
      { new: true }
    ).populate("users");

    if (!updatedPrivacyGroup) {
      throw new Error(`PrivacyGroup with ID ${privacyGroupId} not found.`);
    }

    return updatedPrivacyGroup;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("Failed to add users to privacy group.");
  }
};

export default addUsersToPrivacyGroup;
