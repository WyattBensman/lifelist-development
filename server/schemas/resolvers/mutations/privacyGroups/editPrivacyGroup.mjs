import { User } from "../../../../models/index.mjs";
import { isCurrentUser } from "../../../../utils/auth.mjs";

const editPrivacyGroup = async (
  _,
  { userId, groupId, newGroupName },
  { user }
) => {
  try {
    // Ensure the user is authenticated and is the current user
    isCurrentUser(user, userId);

    // Update the privacy group's name
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId, "settings.privacyGroups._id": groupId },
      { $set: { "settings.privacyGroups.$.groupName": newGroupName } },
      { new: true, runValidators: true }
    );

    // Convert groupId to ObjectId for accurate comparison
    const objectIdGroupId = mongoose.Types.ObjectId(groupId);

    // Find the updated privacy group in the user's settings
    const updatedPrivacyGroup = updatedUser.settings.privacyGroups.find(
      (group) => group._id.equals(objectIdGroupId)
    );

    return updatedPrivacyGroup;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred during privacy group editing.");
  }
};

export default editPrivacyGroup;
