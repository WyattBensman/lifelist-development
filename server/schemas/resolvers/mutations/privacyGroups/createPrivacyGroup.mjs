import { User, PrivacyGroup } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

const createPrivacyGroup = async (_, { groupName, userIds }, { user }) => {
  try {
    isUser(user);

    // Check for duplicate user IDs in the userIds array
    const uniqueUserIds = [...new Set(userIds)];

    if (userIds.length !== uniqueUserIds.length) {
      throw new Error("Duplicate users found in the array.");
    }

    // Create a new PrivacyGroup
    const newPrivacyGroup = await PrivacyGroup.create({
      author: user._id,
      groupName,
      users: userIds,
    });

    // Update the current user's privacyGroups field
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { $push: { privacyGroups: newPrivacyGroup._id } },
      { new: true }
    ).populate({
      path: "privacyGroups",
      populate: { path: "users", model: "User" },
    });

    // Populate the users field in the newPrivacyGroup
    const populatedPrivacyGroup = await PrivacyGroup.populate(newPrivacyGroup, {
      path: "users",
      model: "User",
    });

    return populatedPrivacyGroup;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred during privacy group creation.");
  }
};

export default createPrivacyGroup;
