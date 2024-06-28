import { Collage } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

export const getCollageById = async (_, { collageId }, { user }) => {
  const collage = await Collage.findById(collageId)
    .populate({
      path: "author",
      select: "_id username fullName profilePicture",
    })
    .populate({
      path: "likes reposts saves",
      select: "_id",
    })
    .exec();

  if (!collage) throw new Error("Collage not found.");

  const isLikedByCurrentUser = collage.likes.some((like) =>
    like._id.equals(user._id)
  );
  const isRepostedByCurrentUser = collage.reposts.some((repost) =>
    repost._id.equals(user._id)
  );
  const isSavedByCurrentUser = collage.saves.some((save) =>
    save._id.equals(user._id)
  );

  return {
    collage,
    isLikedByCurrentUser,
    isRepostedByCurrentUser,
    isSavedByCurrentUser,
  };
};

export const getComments = async (_, { collageId }, { user }) => {
  isUser(user);
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
  if (!collage) throw new Error("Collage not found.");
  return collage.comments || [];
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
