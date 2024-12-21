import { Collage, User } from "../../../../models/index.mjs";
import mongoose from "mongoose";

export const getRecommendedProfiles = async (
  _,
  { cursor, limit = 10, recentlySeen = [] },
  { user }
) => {
  try {
    // Step 1: Fetch current user's data
    const currentUser = await User.findById(user)
      .populate({ path: "followers", select: "_id" })
      .populate({ path: "following", select: "_id" })
      .populate({ path: "blocked", select: "_id" });

    if (!currentUser) {
      throw new Error("Current user not found.");
    }

    const userFollowerIds = currentUser.followers.map((follower) =>
      follower._id.toString()
    );
    const userFollowingIds = currentUser.following.map((followed) =>
      followed._id.toString()
    );
    const blockedUserIds = currentUser.blocked.map((blockedUser) =>
      blockedUser._id.toString()
    );

    // Step 2: Exclude users the current user follows, is followed by, has blocked, or recently seen
    const excludedIds = new Set([
      ...userFollowerIds,
      ...userFollowingIds,
      ...blockedUserIds,
      ...recentlySeen,
      user.toString(),
    ]);

    // Step 3: Filter candidates while excluding specific IDs
    const pipeline = [
      // Filter out excluded users
      {
        $match: {
          _id: {
            $nin: Array.from(excludedIds).map(
              (id) => new mongoose.Types.ObjectId(id)
            ),
            ...(cursor && { $gt: new mongoose.Types.ObjectId(cursor) }), // Fetch only users after the cursor
          },
          accessCode: currentUser.accessCode, // Same access code
        },
      },
      // Compute overlap score
      {
        $addFields: {
          overlapScore: {
            $size: {
              $setIntersection: [
                userFollowingIds.map((id) => new mongoose.Types.ObjectId(id)),
                "$followers",
              ],
            },
          },
        },
      },
      // Add total followers count
      {
        $addFields: {
          followerCount: { $size: "$followers" },
        },
      },
      // Return the relevant user fields
      {
        $project: {
          _id: 1,
          username: 1,
          fullName: 1,
          profilePicture: 1,
        },
      },
    ];

    // Step 4: Fetch candidates and shuffle them in Node.js
    const candidates = await User.aggregate(pipeline).exec();
    const shuffledCandidates = candidates.sort(() => Math.random() - 0.5);

    // Step 5: Paginate the results
    const hasNextPage = shuffledCandidates.length > limit;
    const profiles = shuffledCandidates.slice(0, limit);
    const nextCursor = hasNextPage
      ? shuffledCandidates[limit - 1]._id.toString()
      : null;

    return {
      profiles: profiles.map((candidate) => ({
        _id: candidate._id,
        username: candidate.username,
        fullName: candidate.fullName,
        profilePicture: candidate.profilePicture,
      })),
      nextCursor,
      hasNextPage,
    };
  } catch (error) {
    console.error("Error fetching recommended profiles:", error.message);
    throw new Error("Failed to fetch recommended profiles.");
  }
};

export const getRecommendedCollages = async (
  _,
  { cursor, limit = 10, recentlySeen = [] },
  { user }
) => {
  try {
    // Step 1: Fetch current user's data
    const currentUser = await User.findById(user)
      .populate({ path: "followers", select: "_id" })
      .populate({ path: "following", select: "_id" })
      .populate({ path: "blocked", select: "_id" });

    if (!currentUser) {
      throw new Error("Current user not found.");
    }

    const userFollowerIds = currentUser.followers.map((follower) =>
      follower._id.toString()
    );
    const userFollowingIds = currentUser.following.map((followed) =>
      followed._id.toString()
    );
    const blockedUserIds = currentUser.blocked.map((blockedUser) =>
      blockedUser._id.toString()
    );

    // Step 2: Define excluded collages for the current user
    const interactedCollages = await Collage.find({
      $or: [
        { likes: user },
        { reposts: user },
        { saves: user },
        { author: user },
      ],
    })
      .select("_id")
      .lean();

    const excludedCollages = new Set([
      ...recentlySeen,
      ...interactedCollages.map((collage) => collage._id.toString()),
    ]);

    const excludedAuthors = [...userFollowingIds, ...blockedUserIds, user];

    // Step 3: Fetch potential collages with aggregation pipeline
    const collages = await Collage.aggregate([
      // Match public collages excluding specific authors and IDs
      {
        $match: {
          privacy: "PUBLIC",
          archived: false,
          author: {
            $nin: excludedAuthors.map((id) => new mongoose.Types.ObjectId(id)),
          },
          _id: {
            $nin: Array.from(excludedCollages).map(
              (id) => new mongoose.Types.ObjectId(id)
            ),
            ...(cursor && { $gt: new mongoose.Types.ObjectId(cursor) }),
          },
        },
      },
      // Compute overlap score
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "authorData",
        },
      },
      {
        $unwind: "$authorData",
      },
      {
        $match: {
          "authorData.settings.isProfilePrivate": { $ne: true },
        },
      },
      {
        $addFields: {
          overlapScore: {
            $size: {
              $setIntersection: [
                userFollowerIds.map((id) => new mongoose.Types.ObjectId(id)),
                "$authorData.followers",
              ],
            },
          },
        },
      },
      // Sorting criteria: overlapScore and creation time
      {
        $sort: {
          overlapScore: -1,
          createdAt: -1,
        },
      },
      // Project only the fields you want to return
      {
        $project: {
          _id: 1,
          author: {
            _id: "$authorData._id",
            username: "$authorData.username",
            fullName: "$authorData.fullName",
            profilePicture: "$authorData.profilePicture",
          },
          coverImage: 1,
          createdAt: 1,
        },
      },
    ]);

    // Step 4: Shuffle the results
    const shuffledCollages = collages.sort(() => Math.random() - 0.5);

    // Step 5: Paginate the results
    const hasNextPage = shuffledCollages.length > limit;
    const paginatedCollages = shuffledCollages.slice(0, limit);
    const nextCursor = hasNextPage
      ? shuffledCollages[limit - 1]._id.toString()
      : null;

    return {
      collages: paginatedCollages,
      nextCursor,
      hasNextPage,
    };
  } catch (error) {
    console.error("Error fetching recommended collages:", error.message);
    throw new Error("Failed to fetch recommended collages.");
  }
};
