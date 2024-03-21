import { LogbookItem, User } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

const editLogbookItem = async (
  _,
  { logbookItemId, title, date, startDate, endDate, month },
  { user }
) => {
  try {
    isUser(user);

    // Find and update the logbook item
    const updatedLogbookItem = await LogbookItem.findOneAndUpdate(
      { _id: logbookItemId, user: user._id },
      { $set: { title, startDate, endDate, date, month } },
      { new: true, runValidators: true }
    );

    // Check if the logbook item exists
    if (!updatedLogbookItem) {
      throw new Error("Logbook item not found or unauthorized to edit.");
    }

    const updatedUser = await User.findById(user._id).populate("logbook");

    return {
      success: true,
      message: "Logbook item edited successfully",
      action: "EDITED",
      logbook: updatedUser.logbook,
    };
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred while editing the logbook item.");
  }
};

export default editLogbookItem;
