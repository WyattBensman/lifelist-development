import { PrivacyGroup } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

export const getAllPrivacyGroups = async (_, __, { user }) => {
  isUser(user);
  const privacyGroups = await PrivacyGroup.find({ author: user._id })
    .populate("users", "fullName username")
    .exec();
  return privacyGroups;
};

export const getPrivacyGroup = async (_, { privacyGroupId }, { user }) => {
  isUser(user);
  const privacyGroup = await PrivacyGroup.findOne({
    _id: privacyGroupId,
    author: user._id,
  })
    .populate("users", "fullName username profilePicture")
    .exec();
  if (!privacyGroup) {
    throw new Error("Privacy group not found.");
  }
  return privacyGroup;
};
