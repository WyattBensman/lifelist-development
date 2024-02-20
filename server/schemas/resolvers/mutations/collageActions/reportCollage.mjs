// mutations/collageMutations.mjs

import { Collage, User } from "../models/index.mjs";
import { isUser } from "../utils/auth.mjs";

export const reportCollage = async (_, { collageId, reason }, { user }) => {
  try {
    // Check if the user is authenticated
    isUser(user);

    // Check if the collage exists
    const collage = await Collage.findById(collageId);
    if (!collage) {
      throw new Error("Collage not found.");
    }

    // Check if the user has already reported this collage
    const alreadyReported = collage.reports.some(
      (report) => report.user.toString() === user.id
    );
    if (alreadyReported) {
      throw new Error("You have already reported this collage.");
    }

    // Add the user's report to the collage
    collage.reports.push({ user: user.id, reason });
    await collage.save();

    return {
      message: "Collage reported successfully.",
    };
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred during collage reporting.");
  }
};
