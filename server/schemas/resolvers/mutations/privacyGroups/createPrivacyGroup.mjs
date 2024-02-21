import { User } from "../../../../models/index.mjs";
import { isCurrentUser } from "../../../../utils/auth.mjs";

const createPrivacyGroup = async (_, { userId, groupName }, { user }) => {
  try {
    // Ensure the user is authenticated and is the current user
    isCurrentUser(user, userId);

    // Create a new privacy group
    const newPrivacyGroup = { groupName, users: [] };

    // Add the privacy group to the user's settings
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $push: { "settings.privacyGroups": newPrivacyGroup } },
      { new: true, runValidators: true }
    );

    // Find the newly created privacy group in the user's settings
    const createdPrivacyGroup = updatedUser.settings.privacyGroups.find(
      (group) => group.groupName === groupName
    );

    return createdPrivacyGroup;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred during privacy group creation.");
  }
};

export default createPrivacyGroup;
