import { LifeList, LifeListExperience } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

export const getCurrentUserLifeList = async (_, __, { user }) => {
  isUser(user);

  const lifeList = await LifeList.findOne({
    author: user,
  })
    .populate({
      path: "experiences",
      populate: {
        path: "experience",
        select: "_id title image category subCategory",
      },
    })
    .exec();
  if (!lifeList) throw new Error("LifeList not found for the current user.");
  return lifeList;
};

export const getUserLifeList = async (_, { userId }) => {
  /* isUser(user); */

  const lifeList = await LifeList.findOne({ author: userId })
    .populate({
      path: "experiences",
      populate: [
        {
          path: "experience",
          select: "_id title image category subCategory",
        },
        {
          path: "associatedCollages",
          select: "_id coverImage",
        },
        {
          path: "associatedShots.shot",
          select: "_id image",
        },
      ],
    })
    .exec();

  if (!lifeList) throw new Error("LifeList not found for the specified user.");

  // Modify lifeList data to add boolean fields
  const experiencesWithBooleans = lifeList.experiences.map((experience) => ({
    ...experience.toObject(), // convert mongoose doc to plain object
    hasAssociatedShots: experience.associatedShots.length > 0,
    hasAssociatedCollages: experience.associatedCollages.length > 0,
  }));

  return { ...lifeList.toObject(), experiences: experiencesWithBooleans };
};

export const getExperiencedList = async (_, { lifeListId }) => {
  const lifeList = await LifeList.findById(lifeListId).exec();
  if (!lifeList) throw new Error("LifeList not found.");

  const experiencedList = await LifeListExperience.find({
    lifeList: lifeList._id,
    list: "EXPERIENCED",
  })
    .populate({
      path: "experience",
      select: "_id image title category subCategory",
    })
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
    .populate({
      path: "experience",
      select: "_id image title category subCategory",
    })
    .exec();
  return wishListedList;
};

export const getLifeListExperience = async (_, { experienceId }) => {
  const experience = await LifeListExperience.findById(experienceId)
    .populate({
      path: "associatedShots.shot",
      select: "_id image",
    })
    .populate({
      path: "associatedCollages",
      select: "_id coverImage", // Only select specific fields
    })
    .populate({
      path: "experience",
      select: "_id image title category subCategory", // Only select specific fields
    })
    .exec();
  if (!experience) throw new Error("LifeList experience not found.");
  return experience;
};

export const getLifeListExperiencesByExperienceIds = async (
  _,
  { lifeListId, experienceIds }
) => {
  try {
    const lifeListExperiences = await LifeListExperience.find({
      lifeList: lifeListId,
      experience: { $in: experienceIds },
    })
      .populate({
        path: "experience",
        select: "_id title image category subCategory",
      })
      .populate({
        path: "associatedShots.shot",
        select: "_id image capturedAt",
      })
      .populate({
        path: "associatedCollages",
        select: "_id coverImage createdAt",
      });

    return lifeListExperiences;
  } catch (error) {
    throw new Error("Error fetching LifeListExperiences: " + error.message);
  }
};
