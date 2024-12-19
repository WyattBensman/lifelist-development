import { Moment } from "../../../../models/index.mjs";

export const likeMoment = async (_, { momentId }, { user }) => {
  if (!user) {
    throw new Error("Unauthorized");
  }

  try {
    const moment = await Moment.findById(momentId);

    if (!moment) {
      throw new Error("Moment not found.");
    }

    // Check if user has already liked the moment
    if (!moment.likes.includes(user)) {
      moment.likes.push(user);
      await moment.save();
    }

    return {
      momentId,
      success: true,
      message: "Moment successfully liked.",
    };
  } catch (error) {
    console.error("Error liking moment:", error.message);
    throw new Error("Failed to like moment.");
  }
};
