import { Collage, User, LogbookItem } from "../../../../models/index.mjs";
import { isUser, isCurrentAuthor } from "../../../../utils/auth.mjs";

const addToLogbook = async (
  _,
  { collageId, title, date, startDate, finishDate, month },
  { user }
) => {
  try {
    isUser(user);
    await isCurrentAuthor(user, collageId);

    if ((startDate || finishDate) && (date || month)) {
      throw new Error(
        "Provide either startDate and finishDate, or date, or month, not a combination."
      );
    }

    const newLogbookItem = await LogbookItem.create({
      author: user._id,
      title,
      collage: collageId,
      startDate: startDate || null,
      finishDate: finishDate || null,
      date: date || null,
      month: month || null,
    });

    // Add or remove the collage from the user's logbook
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { $push: { logbook: newLogbookItem._id } },
      { new: true, runValidators: true }
    );

    return {
      success: true,
      message: "Log entry added successfully",
      action: "ADDED",
    };
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred while updating the logbook status.");
  }
};

export default addToLogbook;
