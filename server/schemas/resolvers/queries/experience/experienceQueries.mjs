import { Experience } from "../../../../models/index.mjs";

export const getExperience = async (_, { experienceId }) => {
  const experience = await Experience.findById(experienceId).exec();
  if (!experience) throw new Error("Experience not found.");
  return experience;
};

export const getAllExperiences = async (_, { cursor, limit = 20 }) => {
  try {
    // Build the query with optional cursor
    const query = cursor ? { _id: { $gt: cursor } } : {};

    // Fetch experiences using the cursor and limit
    const experiences = await Experience.find(query)
      .sort({ _id: 1 }) // Sort by `_id` ascending
      .limit(limit + 1) // Fetch one extra record to check for next page
      .exec();

    // Determine if there's a next page
    const hasNextPage = experiences.length > limit;

    if (hasNextPage) experiences.pop(); // Remove the extra record

    return {
      experiences,
      nextCursor: hasNextPage ? experiences[experiences.length - 1]._id : null,
      hasNextPage,
    };
  } catch (error) {
    console.error("Error fetching experiences:", error.message);
    throw new Error("Failed to fetch experiences");
  }
};
