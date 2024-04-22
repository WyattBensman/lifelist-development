import { LifeList, Experience } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

export const getCurrentUserLifeList = async (_, __, { user }) => {
  isUser(user);
  const currentUserLifeList = await LifeList.findOne({ author: user._id })
    .populate({
      path: "experiences.experience",
      model: "Experience",
    })
    .exec();
  if (!currentUserLifeList)
    throw new Error("LifeList not found for the current user.");
  return currentUserLifeList;
};

export const getUserLifeList = async (_, { userId }, { user }) => {
  isUser(user);
  const userLifeList = await LifeList.findOne({ author: userId })
    .populate({
      path: "experiences.experience",
      model: "Experience",
    })
    .exec();
  if (!userLifeList)
    throw new Error("LifeList not found for the specified user.");
  return userLifeList;
};

export const getExperiencedList = async (_, { lifeListId }, { user }) => {
  isUser(user);
  const experiencedExperiences = await LifeList.findOne({
    _id: lifeListId,
    "experiences.list": "EXPERIENCED",
  })
    .populate("experiences.experience")
    .exec();
  return experiencedExperiences;
};

export const getWishListedList = async (_, { lifeListId }, { user }) => {
  isUser(user);
  const wishListedExperiences = await LifeList.findOne({
    _id: lifeListId,
    "experiences.list": "WISHLISTED",
  })
    .populate("experiences.experience")
    .exec();
  return wishListedExperiences;
};

export const getSingleExperience = async (
  _,
  { lifeListId, experienceId },
  { user }
) => {
  isUser(user);
  const singleExperience = await LifeList.findOne({
    _id: lifeListId,
    "experiences.experience": experienceId,
  })
    .populate("experiences.experience")
    .exec();
  return singleExperience;
};
