import { LifeList, LifeListExperience } from "../../../../models/index.mjs";

export const getUserLifeList = async (
  _,
  { userId, cursor, limit = 12 },
  { user }
) => {
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
          select: "_id capturedAt image imageThumbnail", // Only fetch the required metadata
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
      capturedAt: shot.capturedAt,
      image: shot.image,
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
      select: "_id capturedAt image imageThumbnail", // Fetch only required fields
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
