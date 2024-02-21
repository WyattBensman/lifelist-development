import { Collage } from "../../../../models/index.mjs";

export const getCollageById = async (_, { collageId }) => {
  try {
    const collage = await Collage.findById(collageId);
    if (!collage) {
      throw new Error("Collage not found.");
    }

    return collage;
  } catch (error) {
    throw new Error(`Error fetching collage by ID: ${error.message}`);
  }
};

export const getCollageComments = async (_, { collageId }) => {
  try {
    const collage = await Collage.findById(collageId).populate({
      path: "comments",
      populate: { path: "user", select: "username fName lName profilePicture" },
    });

    if (!collage) {
      throw new Error("Collage not found.");
    }

    const comments = collage.comments || [];

    return comments;
  } catch (error) {
    throw new Error(
      `Error fetching comments for the collage: ${error.message}`
    );
  }
};

export const getCollageTaggedUsers = async (_, { collageId }) => {
  try {
    const collage = await Collage.findById(collageId).populate({
      path: "tagged",
      select: "username fullName profilePicture",
    });

    if (!collage) {
      throw new Error("Collage not found.");
    }

    return collage.tagged;
  } catch (error) {
    throw new Error(
      `Error fetching tagged users for the collage: ${error.message}`
    );
  }
};
