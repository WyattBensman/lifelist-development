import { PrivacyGroup } from "../../../../models/index.mjs";
import {
  isUser,
  isCurrentPrivacyGroupAuthor,
} from "../../../../utils/auth.mjs";

const addUsersToPrivacyGroup = async (
  _,
  { privacyGroupId, userIds },
  { user }
) => {
  try {
    // Check if the user is authenticated
    isUser(user);

    // Check if the user is the author of the PrivacyGroup
    await isCurrentPrivacyGroupAuthor(user, privacyGroupId);

    // Update the PrivacyGroup to add unique users using $addToSet
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
    throw new Error("An error occurred during user addition to privacy group.");
  }
};

export default addUsersToPrivacyGroup;
