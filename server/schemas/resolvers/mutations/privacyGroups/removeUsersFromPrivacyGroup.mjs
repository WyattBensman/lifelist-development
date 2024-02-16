import { User } from "../../../../models/index.mjs";
import { isCurrentUser } from "../../../../utils/auth.mjs";

export const removeUserFromPrivacyGroup = async (
  _,
  { userId, groupId, userToRemoveId },
  { user }
) => {
  try {
    // Ensure the user is authenticated and is the current user
    isCurrentUser(user, userId);

    // Remove the user from the privacy group
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId, "settings.privacyGroups._id": groupId },
      { $pull: { "settings.privacyGroups.$.users": userToRemoveId } },
      { new: true, runValidators: true }
    );

    return updatedUser.settings.privacyGroups.find(
      (group) => group._id.toString() === groupId
    );
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error(
      "An error occurred during user removal from privacy group."
    );
  }
};
