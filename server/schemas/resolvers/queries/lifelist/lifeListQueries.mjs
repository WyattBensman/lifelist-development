import { LifeList } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

export const getCurrentUserLifeList = async (_, __, { user }) => {
  try {
    isUser(user);

    const currentUserLifeList = await LifeList.findOne({
      author: user._id,
    }).populate({
      path: "experiences.experience",
      model: "Experience",
    });

    if (!currentUserLifeList) {
      throw new Error("LifeList not found for the current user.");
    }

    return currentUserLifeList;
  } catch (error) {
    throw new Error(`Error fetching user's life list: ${error.message}`);
  }
};

export const getUserLifeList = async (_, { userId }, { user }) => {
  try {
    isUser(user);

    const userLifeList = await LifeList.findOne({
      author: userId,
    }).populate({
      path: "experiences.experience",
      model: "Experience",
    });

    if (!userLifeList) {
      throw new Error("LifeList not found for the specified user.");
    }

    return userLifeList;
  } catch (error) {
    throw new Error(`Error fetching user's life list: ${error.message}`);
  }
};

export const getExperiencedList = async (_, { lifeListId }, { user }) => {
  try {
    isUser(user);

    const experiencedExperiences = await LifeList.findOne({
      _id: lifeListId,
      "experiences.list": "EXPERIENCED",
    }).populate("experiences.experience");

    return experiencedExperiences;
  } catch (error) {
    throw new Error(`Error fetching experienced experiences: ${error.message}`);
  }
};

export const getWishListedList = async (_, { lifeListId }, { user }) => {
  try {
    isUser(user);

    const experiencedExperiences = await LifeList.findOne({
      _id: lifeListId,
      "experiences.list": "WISHLISTED",
    }).populate("experiences.experience");

    return experiencedExperiences;
  } catch (error) {
    throw new Error(`Error fetching experienced experiences: ${error.message}`);
  }
};

export const getSingleExperience = async (
  _,
  { lifeListId, experienceId },
  { user }
) => {
  try {
    isUser(user);

    const singleExperience = await LifeList.findOne({
      _id: lifeListId,
      "experiences.experience": experienceId,
    }).populate("experiences.experience");

    return singleExperience;
  } catch (error) {
    throw new Error(`Error fetching wishlist experience: ${error.message}`);
  }
};
