import { User } from "../../../../models/index.mjs";
import { isCurrentUser } from "../../../../utils/auth.mjs";

const createPrivacyGroup = async (_, { groupName, userIds }, { user }) => {
  try {
    // Ensure the user is authenticated and is the current user
    /* isCurrentUser(user, userId); */

    // Create a new privacy group with the specified users
    const newPrivacyGroup = { groupName, users: userIds || [] };

    // Add the privacy group to the user's settings
    const updatedUser = await User.findByIdAndUpdate(
      "65d762da8d7b7d7105af76b3",
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
