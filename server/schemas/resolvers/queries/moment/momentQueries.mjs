import { Moment, User } from "../../../../models/index.mjs";

export const getUserMoments = async (_, { userId }) => {
  try {
    // Fetch the user and populate their moments
    const userWithMoments = await User.findById(userId).populate({
      path: "moments",
      populate: {
        path: "cameraShot", // Populate cameraShot details
        select: "_id image",
      },
    });

    if (!userWithMoments) {
      throw new Error("User not found.");
    }

    // Filter moments: Exclude expired ones
    const validMoments = userWithMoments.moments.filter(
      (moment) => new Date(moment.expiresAt) > new Date()
    );

    // Map moments to required structure
    return validMoments.map((moment) => ({
      _id: moment._id,
      author: {
        _id: userWithMoments._id,
        username: userWithMoments.username,
        fullName: userWithMoments.fullName,
        profilePicture: userWithMoments.profilePicture,
      },
      cameraShot: {
        _id: moment.cameraShot?._id || null,
        image: moment.cameraShot?.image || null,
      },
      createdAt: moment.createdAt,
      expiresAt: moment.expiresAt,
      views: moment.views.map((view) => ({ _id: view })), // Map views
      likes: moment.likes.map((like) => ({ _id: like })), // Map likes
    }));
  } catch (error) {
    console.error("Error fetching user moments:", error.message);
    throw new Error("Failed to fetch user moments.");
  }
};

export const getFriendsMoments = async (
  _,
  { cursor, limit = 10 },
  { user }
) => {
  try {
    const currentUser = await User.findById(user).populate({
      path: "following",
      populate: {
        path: "moments",
        populate: {
          path: "cameraShot",
          select: "_id image imageThumbnail",
        },
      },
    });

    if (!currentUser) {
      throw new Error("Current user not found.");
    }

    // Flatten and filter moments of all following users
    let moments = currentUser.following.flatMap((followedUser) =>
      followedUser.moments
        .filter((moment) => new Date(moment.expiresAt) > new Date()) // Filter expired moments
        .map((moment) => ({
          _id: moment._id,
          author: {
            _id: followedUser._id,
            username: followedUser.username,
            fullName: followedUser.fullName,
            profilePicture: followedUser.profilePicture,
          },
          cameraShot: moment.cameraShot,
          createdAt: moment.createdAt,
          expiresAt: moment.expiresAt,
          views: moment.views.map((view) => ({ _id: view })), // Include views
          likes: moment.likes.map((like) => ({ _id: like })), // Include likes
        }))
    );

    // Sort moments by creation date in descending order (most recent first)
    moments = moments.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    // If a cursor is provided, filter moments created before the cursor
    if (cursor) {
      moments = moments.filter(
        (moment) => new Date(moment.createdAt) < new Date(cursor)
      );
    }

    // Limit the results to the specified number
    const paginatedMoments = moments.slice(0, limit);

    // Determine the next cursor and hasNextPage
    const hasNextPage = moments.length > limit;
    const nextCursor = hasNextPage
      ? paginatedMoments[paginatedMoments.length - 1].createdAt
      : null;

    return {
      moments: paginatedMoments,
      nextCursor,
      hasNextPage,
    };
  } catch (error) {
    console.error("Error fetching following users' moments:", error.message);
    throw new Error("Failed to fetch following users' moments.");
  }
};

export const getMomentLikes = async (_, { momentId }) => {
  try {
    // Find the moment and populate the `likes` field
    const momentWithLikes = await Moment.findById(momentId)
      .populate({
        path: "likes",
        select: "_id username fullName profilePicture", // Only select necessary fields
      })
      .select("likes"); // Select only the `likes` field

    if (!momentWithLikes) {
      throw new Error("Moment not found.");
    }

    // Structure the response
    return momentWithLikes.likes.map((user) => ({
      _id: user._id,
      username: user.username,
      fullName: user.fullName,
      profilePicture: user.profilePicture,
    }));
  } catch (error) {
    console.error("Error fetching moment likes:", error.message);
    throw new Error("Failed to fetch moment likes.");
  }
};
