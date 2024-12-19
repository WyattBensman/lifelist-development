import { Collage, User } from "../../../../models/index.mjs";
import mongoose from "mongoose";

export const getRecommendedProfiles = async (
  _,
  { cursor, limit = 10 },
  { user }
) => {
  try {
    console.log("userId", user);

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

    // Step 2: Exclude users the current user follows, is followed by, or has blocked
    const excludedIds = new Set([
      ...userFollowerIds,
      ...userFollowingIds,
      ...blockedUserIds,
      user,
    ]);

    // Step 3: Fetch potential candidates with pagination
    const candidates = await User.aggregate([
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
      // Sorting criteria (relevance: overlapScore, follower count)
      {
        $sort: {
          overlapScore: -1,
          followerCount: -1,
        },
      },
      // Limit the results to the requested batch size
      {
        $limit: limit + 1, // Fetch one extra to determine if there's a next page
      },
      // Return the relevant user fields
      {
        $project: {
          _id: 1,
          username: 1,
          fullName: 1,
          profilePicture: 1,
          overlapScore: 1,
          followerCount: 1,
        },
      },
    ]);

    // Step 4: Check if there's a next page
    const hasNextPage = candidates.length > limit;
    const profiles = candidates.slice(0, limit); // Return only the first `limit` profiles
    const nextCursor = hasNextPage ? candidates[limit - 1]._id : null; // Cursor is the last profile's ID

    return {
      profiles: profiles.map((candidate) => ({
        user: {
          _id: candidate._id,
          username: candidate.username,
          fullName: candidate.fullName,
          profilePicture: candidate.profilePicture,
        },
        overlapScore: candidate.overlapScore,
        followerCount: candidate.followerCount,
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
  { cursor, limit = 10 },
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

    // Step 2: Define excluded collages for the currentUser
    const excludedCollages = new Set();

    // Add collages from the current user and their interactions
    const excludedAuthors = [...userFollowingIds, ...blockedUserIds, user];
    const interactedCollages = await Collage.find({
      $or: [
        { likes: user },
        { reposts: user },
        { saves: user },
        { author: user }, // Exclude collages authored by the current user
      ],
    }).select("_id");

    interactedCollages.forEach((collage) =>
      excludedCollages.add(collage._id.toString())
    );

    // Step 3: Fetch potential collages with pagination
    const collages = await Collage.aggregate([
      // Match public collages that are not archived or from excluded authors
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
            ...(cursor && { $gt: new mongoose.Types.ObjectId(cursor) }), // Handle cursor-based pagination
          },
        },
      },
      // Compute popularity score (likes, reposts, saves)
      {
        $addFields: {
          popularityScore: {
            $add: [
              { $size: "$likes" },
              { $size: "$reposts" },
              { $size: "$saves" },
            ],
          },
        },
      },
      // Compute overlap score (mutual followers with the collage author)
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
      // Sorting criteria: overlapScore, popularityScore, and creation time
      {
        $sort: {
          overlapScore: -1,
          popularityScore: -1,
          createdAt: -1,
        },
      },
      // Limit the results to limit + 1 to determine if there's a next page
      { $limit: limit + 1 },
      // Project the necessary fields
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
          likesCount: { $size: "$likes" },
          repostsCount: { $size: "$reposts" },
          savesCount: { $size: "$saves" },
          overlapScore: 1,
          popularityScore: 1,
        },
      },
    ]);

    // Step 4: Check if there's a next page
    const hasNextPage = collages.length > limit;
    const paginatedCollages = collages.slice(0, limit); // Return only the first `limit` collages
    const nextCursor = hasNextPage ? collages[limit - 1]._id : null; // Cursor is the last collage in this batch

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
