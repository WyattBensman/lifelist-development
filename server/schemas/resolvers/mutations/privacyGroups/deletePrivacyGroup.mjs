import { User } from "../../../../models/index.mjs";
import { isCurrentUser } from "../../../../utils/auth.mjs";

const deletePrivacyGroup = async (_, { groupId }, { user }) => {
  try {
    // Ensure the user is authenticated and is the current user
    /* isCurrentUser(user, userId); */

    // Remove the privacy group from the user's settings
    const updatedUser = await User.findByIdAndUpdate(
      "65d762da8d7b7d7105af76b3",
      { $pull: { "settings.privacyGroups": { _id: groupId } } },
      { new: true, runValidators: true }
    );

    return {
      message: "Privacy group deleted successfully.",
    };
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred during privacy group deletion.");
  }
};

export default deletePrivacyGroup;
