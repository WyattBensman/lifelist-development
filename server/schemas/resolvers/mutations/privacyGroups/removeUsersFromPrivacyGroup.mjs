import { PrivacyGroup } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

const removeUsersFromPrivacyGroup = async (
  _,
  { privacyGroupId, userIds },
  { user }
) => {
  try {
    isUser(user);

    // Remove specified users from the PrivacyGroup
    const updatedPrivacyGroup = await PrivacyGroup.findByIdAndUpdate(
      privacyGroupId,
      { $pullAll: { users: userIds } },
      { new: true }
    ).populate("users");

    if (!updatedPrivacyGroup) {
      throw new Error(`PrivacyGroup with ID ${privacyGroupId} not found.`);
    }

    return updatedPrivacyGroup;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("Failed to remove users from privacy group.");
  }
};

export default removeUsersFromPrivacyGroup;
