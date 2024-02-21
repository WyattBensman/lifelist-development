import { User } from "../../../../models/index.mjs";
import { isCurrentUser } from "../../../../utils/auth.mjs";

const addUsersToPrivacyGroup = async (
  _,
  { userId, groupId, userToAddId },
  { user }
) => {
  try {
    // Ensure the user is authenticated and is the current user
    isCurrentUser(user, userId);

    // Find the user to be added to the privacy group
    const userToAdd = await User.findById(userToAddId);

    // Check if the user exists
    if (!userToAdd) {
      throw new Error("User to add not found.");
    }

    // Add the user to the privacy group
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId, "settings.privacyGroups._id": groupId },
      { $addToSet: { "settings.privacyGroups.$.users": userToAddId } },
      { new: true, runValidators: true }
    );

    return updatedUser.settings.privacyGroups.find(
      (group) => group._id.toString() === groupId
    );
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred during user addition to privacy group.");
  }
};

export default addUsersToPrivacyGroup;
