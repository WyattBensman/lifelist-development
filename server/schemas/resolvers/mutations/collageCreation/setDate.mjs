import { Collage } from "../../../../models/index.mjs";
import { isUser, isCurrentAuthor } from "../../../../utils/auth.mjs";

const setDate = async (
  _,
  { collageId, startDate, finishDate, date, month },
  { user }
) => {
  try {
    // Check if the user is authenticated
    isUser(user);

    // Check if the user is the author
    await isCurrentAuthor(user, collageId);

    // Validate that either startDate and finishDate go together, or date, or month is provided
    if ((startDate || finishDate) && (date || month)) {
      throw new Error(
        "Provide either startDate and finishDate, or date, or month, not a combination."
      );
    }

    // Update date for the collage
    const updatedCollage = await Collage.findByIdAndUpdate(
      collageId,
      {
        startDate: startDate || null,
        finishDate: finishDate || null,
        date: date || null,
        month: month || null,
      },
      { new: true }
    );

    return {
      success: true,
      message: "Date set successfully",
      collageId: collageId,
      startDate: updatedCollage.startDate,
      finishDate: updatedCollage.finishDate,
      date: updatedCollage.date,
      month: updatedCollage.month,
    };
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred while setting the date.");
  }
};

export default setDate;
