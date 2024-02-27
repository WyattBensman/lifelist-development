import { User } from "../../../../models/index.mjs";
import { isCurrentUser } from "../../../../utils/auth.mjs";

const removeUsersFromPrivacyGroup = async (
  _,
  { groupId, userIds },
  { user }
) => {
  try {
    // Ensure the user is authenticated and is the current user
    /* isCurrentUser(user, userId); */

    // Check if the privacy group exists
    const privacyGroupExists = await User.exists({
      _id: "65d762da8d7b7d7105af76b3",
      "settings.privacyGroups._id": groupId,
    });

    if (!privacyGroupExists) {
      throw new Error("Privacy group not found");
    }

    // Remove users from the privacy group
    const updatedUser = await User.findByIdAndUpdate(
      "65d762da8d7b7d7105af76b3",
      {
        $pullAll: {
          "settings.privacyGroups.$[group].users": userIds,
        },
      },
      {
        arrayFilters: [{ "group._id": groupId }],
        new: true,
        runValidators: true,
      }
    );

    // Find the updated privacy group in the user's settings
    const updatedPrivacyGroup = updatedUser.settings.privacyGroups.find(
      (group) => group._id.toString() === groupId
    );

    return updatedPrivacyGroup;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error(
      "An error occurred during user removal from privacy group."
    );
  }
};

export default removeUsersFromPrivacyGroup;
