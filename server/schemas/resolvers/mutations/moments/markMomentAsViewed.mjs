import { Moment } from "../../../../models/index.mjs";

export const markMomentAsViewed = async (_, { momentId }, { user }) => {
  if (!user) {
    throw new Error("Unauthorized");
  }

  try {
    const moment = await Moment.findById(momentId);

    if (!moment) {
      throw new Error("Moment not found.");
    }

    // Add the user to the views array if they haven't already viewed the moment
    if (!moment.views.includes(user)) {
      moment.views.push(user);
      await moment.save();
    }

    return true;
  } catch (error) {
    console.error("Error marking moment as viewed:", error.message);
    throw new Error("Failed to mark moment as viewed.");
  }
};
