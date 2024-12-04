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

export const getUserLifeList = async (
  _,
  { userId, cursor, limit = 12 },
  { user }
) => {
  isUser(user); // Ensure the user is authenticated

  // Fetch LifeList for the user
  const lifeList = await LifeList.findOne({ author: userId })
    .populate({
      path: "experiences",
      match: cursor ? { _id: { $gt: cursor } } : {}, // Cursor-based pagination
      options: {
        sort: { _id: 1 }, // Sort experiences by _id in ascending order
        limit: limit + 1, // Fetch one extra record to check for next page
      },
      populate: [
        {
          path: "experience",
          select: "_id title image category subCategory",
        },
        {
          path: "associatedShots", // Directly populate associatedShots as CameraShot objects
          select: "_id imageThumbnail", // Only fetch the required metadata
        },
      ],
    })
    .exec();

  if (!lifeList) throw new Error("LifeList not found for the specified user.");

  // Modify experiences to include hasAssociatedShots and associatedShots metadata
  const experiencesWithMetadata = lifeList.experiences.map((experience) => ({
    _id: experience._id,
    list: experience.list,
    experience: {
      _id: experience.experience._id,
      title: experience.experience.title,
      image: experience.experience.image,
      category: experience.experience.category,
      subCategory: experience.experience.subCategory,
    },
    hasAssociatedShots: experience.associatedShots.length > 0,
    associatedShots: experience.associatedShots.map((shot) => ({
      _id: shot._id,
      imageThumbnail: shot.imageThumbnail, // Include lightweight metadata
    })),
  }));

  // Determine if there's a next page
  const hasNextPage = experiencesWithMetadata.length > limit;

  // Remove the extra record used to check for the next page
  if (hasNextPage) experiencesWithMetadata.pop();

  return {
    _id: lifeList._id,
    experiences: experiencesWithMetadata,
    nextCursor: hasNextPage
      ? experiencesWithMetadata[experiencesWithMetadata.length - 1]._id
      : null,
    hasNextPage,
  };
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

export const getLifeListExperience = async (
  _,
  { experienceId, cursor, limit = 12 }
) => {
  // Fetch the LifeListExperience by ID
  const lifeListExperience = await LifeListExperience.findById(experienceId)
    .populate({
      path: "associatedShots",
      match: {
        ...(cursor && { _id: { $gt: cursor } }), // Apply cursor filter if provided
      },
      options: {
        sort: { _id: 1 }, // Sort by _id in ascending order
        limit: limit + 1, // Fetch one extra record to check for the next page
      },
      select: "_id imageThumbnail", // Fetch only required fields
    })
    .populate({
      path: "experience",
      select: "_id image title category subCategory", // Fetch experience details
    })
    .exec();

  if (!lifeListExperience) {
    throw new Error("LifeList experience not found.");
  }

  // Extract paginated associated shots
  const associatedShots = lifeListExperience.associatedShots || [];

  // Determine if there are more pages
  const hasNextPage = associatedShots.length > limit;
  if (hasNextPage) associatedShots.pop(); // Remove the extra record for pagination

  return {
    lifeListExperience: {
      ...lifeListExperience.toObject(),
      associatedShots, // Attach paginated associated shots
    },
    nextCursor: hasNextPage
      ? associatedShots[associatedShots.length - 1]._id
      : null,
    hasNextPage,
  };
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
