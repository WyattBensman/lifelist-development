import { Collage } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

export const getCollageById = async (_, { collageId }) => {
  const collage = await Collage.findById(collageId)
    .populate({
      path: "author",
      select: "username fullName",
    })
    .exec();
  if (!collage) throw new Error("Collage not found.");
  return collage;
};

export const getCollageMedia = async (_, { collageId }) => {
  const collage = await Collage.findById(collageId).select("images").exec();
  if (!collage) throw new Error("Collage not found.");
  return collage.images || [];
};

export const getCollageSummary = async (_, { collageId }) => {
  const collage = await Collage.findById(collageId)
    .select("entries experiences")
    .populate("experiences")
    .exec();
  if (!collage) throw new Error("Collage not found.");
  return {
    entries: collage.entries || [],
    experiences: collage.experiences || [],
  };
};

export const getCollageComments = async (_, { collageId }, { user }) => {
  isUser(user);
  const collage = await Collage.findById(collageId)
    .populate({
      path: "comments",
      populate: {
        path: "author",
        select: "username fullName profilePicture",
      },
    })
    .exec();
  if (!collage) throw new Error("Collage not found.");
  return collage.comments || [];
};

export const getCollageTaggedUsers = async (_, { collageId }, { user }) => {
  isUser(user);
  const collage = await Collage.findById(collageId)
    .populate({
      path: "tagged",
      select: "username fullName profilePicture",
    })
    .exec();
  if (!collage) throw new Error("Collage not found.");
  return collage.tagged;
};
