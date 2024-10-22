import { Collage } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

export const getCollageById = async (_, { collageId }, { user }) => {
  // Find the collage by ID, and populate necessary fields
  const collage = await Collage.findById(collageId)
    .populate({
      path: "author",
      select: "_id username fullName profilePicture",
    })
    .populate({
      path: "likes reposts saves",
      select: "_id",
    })
    .populate({
      path: "tagged", // Populate to check participants, but not return it
      select: "_id",
    })
    .exec();

  if (!collage) throw new Error("Collage not found.");

  // Check if the collage has participants
  const hasParticipants = collage.tagged.length > 0;

  // Check if the collage is liked, reposted, or saved by the current user
  const isLikedByCurrentUser = collage.likes.some((like) =>
    like._id.equals(user)
  );
  const isRepostedByCurrentUser = collage.reposts.some((repost) =>
    repost._id.equals(user)
  );
  const isSavedByCurrentUser = collage.saves.some((save) =>
    save._id.equals(user)
  );

  return {
    collage,
    isLikedByCurrentUser,
    isRepostedByCurrentUser,
    isSavedByCurrentUser,
    hasParticipants,
  };
};

export const getComments = async (_, { collageId }, { user }) => {
  try {
    isUser(user);
    console.log(`Fetching comments for collageId: ${collageId}`);
    const collage = await Collage.findById(collageId)
      .populate({
        path: "comments",
        populate: [
          {
            path: "author",
            select: "_id username fullName profilePicture",
          },
          {
            path: "likedBy",
            select: "_id",
          },
        ],
      })
      .exec();

    if (!collage) {
      console.error(`Collage not found for ID: ${collageId}`);
      throw new Error("Collage not found.");
    }

    console.log(`Comments fetched successfully for collageId: ${collageId}`);
    return collage.comments || [];
  } catch (error) {
    console.error(
      `Error fetching comments for collageId: ${collageId} - ${error.message}`
    );
    throw new Error(error.message);
  }
};

export const getTaggedUsers = async (_, { collageId }, { user }) => {
  isUser(user);
  const collage = await Collage.findById(collageId)
    .populate({
      path: "tagged",
      select: "_id username fullName profilePicture",
    })
    .exec();
  if (!collage) throw new Error("Collage not found.");
  return collage.tagged;
};

export const getInteractions = async (_, { collageId }, { user }) => {
  isUser(user);
  const collage = await Collage.findById(collageId)
    .populate("likes reposts saves comments")
    .exec();

  if (!collage) throw new Error("Collage not found.");

  // Assuming likes, reposts, saves, and comments are arrays of user IDs
  const likesCount = collage.likes.length;
  const repostsCount = collage.reposts.length;
  const savesCount = collage.saves.length;
  const commentsCount = collage.comments.length;

  return {
    likes: likesCount,
    reposts: repostsCount,
    saves: savesCount,
    comments: commentsCount,
  };
};
