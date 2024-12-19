import { Moment, User } from "../../../../models/index.mjs";

export const deleteMoment = async (_, { momentId }, { user }) => {
  if (!user) {
    throw new Error("Unauthorized");
  }

  try {
    const moment = await Moment.findById(momentId);

    if (!moment) {
      throw new Error("Moment not found.");
    }

    // Ensure the user is the author of the moment
    if (!moment.author.equals(user)) {
      throw new Error("You can only delete your own moments.");
    }

    // Delete the moment
    await moment.deleteOne();

    // Remove the moment reference from the user's moments array
    await User.findByIdAndUpdate(
      user,
      { $pull: { moments: momentId } }, // Remove momentId from moments array
      { new: true }
    );

    return {
      deletedMomentId: momentId,
      success: true,
      message: "Moment successfully deleted.",
    };
  } catch (error) {
    console.error("Error deleting moment:", error.message);
    throw new Error("Failed to delete moment.");
  }
};
