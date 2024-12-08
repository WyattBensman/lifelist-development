import { Story, User } from "../../../../models/index.mjs";

export const getRecommendedStories = async (_, { cursor, limit }, { user }) => {
  try {
    const currentUserId = user;
    const currentAccessCode = user.accessCode;

    // Step 1: Get all users with the same access code
    const usersWithAccessCode = await User.find({
      accessCode: currentAccessCode,
    }).select("_id");

    const userIds = usersWithAccessCode.map((u) => u._id);

    // Step 2: Fetch stories (exclude expired and viewed by the current user)
    const query = {
      author: { $in: userIds },
      expiresAt: { $gt: new Date() }, // Only non-expired stories
      views: { $ne: currentUserId }, // Exclude already viewed stories
    };

    // Step 3: Sorting by views and author's follower count
    const sortCriteria = [
      { $sort: { "views.length": -1 } }, // Fewer views first
      { $sort: { "author.followers.length": -1 } }, // More followers first
    ];

    const pipeline = [
      { $match: query },
      ...sortCriteria,
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "author",
        },
      },
      { $unwind: "$author" },
      {
        $lookup: {
          from: "camerashots",
          localField: "cameraShot",
          foreignField: "_id",
          as: "cameraShot",
        },
      },
      { $unwind: "$cameraShot" },
    ];

    // Step 4: Pagination
    if (cursor) {
      pipeline.push({ $match: { _id: { $gt: cursor } } }); // Fetch stories after the cursor
    }
    pipeline.push({ $limit: limit });

    const stories = await Story.aggregate(pipeline);

    // Step 5: Refetch Logic (Retain top 4, add 12 new)
    const previousBatchStories = await getPreviousBatch(cursor);
    const retainedStories = shuffleArray(previousBatchStories.slice(0, 4));
    const newStories = stories
      .filter((s) => !previousBatchStories.find((ps) => ps._id.equals(s._id)))
      .slice(0, 12);

    const finalStories = [...retainedStories, ...newStories];

    return {
      stories: finalStories,
      cursor:
        finalStories.length > 0
          ? finalStories[finalStories.length - 1]._id
          : null,
      hasNextPage: stories.length === limit,
    };
  } catch (error) {
    console.error("Error fetching recommended stories:", error);
    throw new Error("Failed to fetch recommended stories.");
  }
};
