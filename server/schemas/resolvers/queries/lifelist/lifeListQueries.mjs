import { LifeList } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

export const getCurrentUserLifeList = async (_, __, { user }) => {
  isUser(user);

  const lifeList = await LifeList.findOne({ author: user._id })
    .populate("experiences")
    .exec();
  if (!lifeList) throw new Error("LifeList not found for the current user.");
  return lifeList;
};

export const getUserLifeList = async (_, { userId }, { user }) => {
  isUser(user);

  const lifeList = await LifeList.findOne({ author: userId })
    .populate("experiences")
    .exec();
  if (!lifeList) throw new Error("LifeList not found for the specified user.");
  return lifeList;
};

export const getExperiencedList = async (_, { lifeListId }) => {
  const lifeList = await LifeList.findById(lifeListId).exec();
  if (!lifeList) throw new Error("LifeList not found.");

  const experiencedList = await LifeListExperience.find({
    lifeList: lifeList._id,
    list: "EXPERIENCED",
  })
    .populate("experience")
    .exec();
  return experiencedList;
};

export const getWishListedList = async (_, { lifeListId }) => {
  const lifeList = await LifeList.findById(lifeListId).exec();
  if (!lifeList) throw new Error("LifeList not found.");

  const wishListedList = await LifeListExperience.find({
    lifeList: lifeList._id,
    list: "WISHLISTED",
  })
    .populate("experience")
    .exec();
  return wishListedList;
};

export const getLifeListExperience = async (_, { experienceId }) => {
  const experience = await LifeListExperience.findById(experienceId)
    .populate("experience")
    .exec();
  if (!experience) throw new Error("LifeList experience not found.");
  return experience;
};
