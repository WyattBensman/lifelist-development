import { PrivacyGroup } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

export const getPrivacyGroups = async (_, __, { user }) => {
  try {
    isUser(user);

    const privacyGroups = await PrivacyGroup.find({
      author: user._id,
    }).populate({
      path: "users",
      select: "fullName username",
    });

    return privacyGroups;
  } catch (error) {
    throw new Error(`Error fetching privacy groups: ${error.message}`);
  }
};

export const getSpecificPrivacyGroup = async (
  _,
  { privacyGroupId },
  { user }
) => {
  try {
    isUser(user);

    const privacyGroup = await PrivacyGroup.findOne({
      _id: privacyGroupId,
      author: user._id,
    }).populate({
      path: "users",
      select: "fullName username profilePicture",
    });

    if (!privacyGroup) {
      throw new Error(`Privacy group not found.`);
    }

    return privacyGroup;
  } catch (error) {
    throw new Error(`Error fetching specific privacy group: ${error.message}`);
  }
};
