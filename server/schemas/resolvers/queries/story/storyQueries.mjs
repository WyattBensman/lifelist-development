import { User } from "../../../../models/index.mjs";

export const getUserStories = async (_, { userId }) => {
  try {
    const user = await User.findById(userId).populate({
      path: "stories",
      populate: {
        path: "cameraShot", // Populate cameraShot details
        select: "_id image imageThumbnail",
      },
    });

    if (!user) {
      throw new Error("User not found.");
    }

    // Return filtered and structured stories
    return user.stories
      .filter((story) => new Date(story.expiresAt) > new Date()) // Filter expired stories
      .map((story) => ({
        _id: story._id,
        author: {
          _id: user._id,
          username: user.username,
          fullName: user.fullName,
          profilePicture: user.profilePicture,
        },
        cameraShot: story.cameraShot,
        createdAt: story.createdAt,
        expiresAt: story.expiresAt,
        views: story.views.map((view) => ({ _id: view })),
      }));
  } catch (error) {
    console.error("Error fetching user stories:", error.message);
    throw new Error("Failed to fetch user stories.");
  }
};

export const getFollowingUsersStories = async (_, __, { user }) => {
  try {
    const currentUser = await User.findById(user._id).populate({
      path: "following",
      populate: {
        path: "stories",
        populate: {
          path: "cameraShot", // Populate cameraShot details
          select: "_id image imageThumbnail",
        },
      },
    });

    if (!currentUser) {
      throw new Error("Current user not found.");
    }

    // Flatten and filter stories of all following users
    const stories = currentUser.following.flatMap((followedUser) =>
      followedUser.stories
        .filter((story) => new Date(story.expiresAt) > new Date()) // Filter expired stories
        .map((story) => ({
          _id: story._id,
          author: {
            _id: followedUser._id,
            username: followedUser.username,
            fullName: followedUser.fullName,
            profilePicture: followedUser.profilePicture,
          },
          cameraShot: story.cameraShot,
          createdAt: story.createdAt,
          expiresAt: story.expiresAt,
          views: story.views.map((view) => ({ _id: view })),
        }))
    );

    return stories;
  } catch (error) {
    console.error("Error fetching following users' stories:", error.message);
    throw new Error("Failed to fetch following users' stories.");
  }
};
