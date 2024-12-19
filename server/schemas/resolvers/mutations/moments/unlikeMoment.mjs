import { Moment } from "../../../../models/index.mjs";

export const unlikeMoment = async (_, { momentId }, { user }) => {
  if (!user) {
    throw new Error("Unauthorized");
  }

  try {
    const moment = await Moment.findById(momentId);

    if (!moment) {
      throw new Error("Moment not found.");
    }

    // Remove the user's like if it exists
    moment.likes = moment.likes.filter((u) => !u.equals(user));
    await moment.save();

    return {
      momentId,
      success: true,
      message: "Moment successfully unliked.",
    };
  } catch (error) {
    console.error("Error unliking moment:", error.message);
    throw new Error("Failed to unlike moment.");
  }
};
