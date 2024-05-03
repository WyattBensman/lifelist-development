import { User, PrivacyGroup } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

const createPrivacyGroup = async (_, { groupName, userIds }, { user }) => {
  try {
    isUser(user);

    // Prevent duplicate user IDs
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

    // Link PrivacyGroup to the user's profile
    await User.findByIdAndUpdate(
      user._id,
      { $push: { privacyGroups: newPrivacyGroup._id } },
      { new: true }
    );

    return await PrivacyGroup.populate(newPrivacyGroup, { path: "users" });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("Failed to create privacy group.");
  }
};

export default createPrivacyGroup;
