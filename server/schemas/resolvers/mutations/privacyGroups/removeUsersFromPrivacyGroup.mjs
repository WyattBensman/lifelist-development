import { PrivacyGroup } from "../../../../models/index.mjs";
import {
  isUser,
  isCurrentPrivacyGroupAuthor,
} from "../../../../utils/auth.mjs";

const removeUsersFromPrivacyGroup = async (
  _,
  { privacyGroupId, userIds },
  { user }
) => {
  try {
    // Check if the user is authenticated
    isUser(user);

    // Check if the user is the author of the PrivacyGroup
    await isCurrentPrivacyGroupAuthor(user, privacyGroupId);

    // Update the PrivacyGroup to remove users
    const updatedPrivacyGroup = await PrivacyGroup.findByIdAndUpdate(
      privacyGroupId,
      { $pullAll: { users: userIds } },
      { new: true }
    ).populate("users");

    if (!updatedPrivacyGroup) {
      throw new Error(`Privacy Group not found.`);
    }

    return updatedPrivacyGroup;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error(
      "An error occurred during user removal from privacy group."
    );
  }
};

export default removeUsersFromPrivacyGroup;
