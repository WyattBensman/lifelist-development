import { LogbookItem, User } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

const deleteLogbookItem = async (_, { logbookItemId }, { user }) => {
  try {
    // Check authentication
    isUser(user);

    // Find the logbook item by ID
    const logbookItem = await LogbookItem.findByIdAndDelete(logbookItemId);

    // Check if the logbook item exists
    if (!logbookItem) {
      throw new Error("Logbook item not found.");
    }

    // Remove the logbook item ID from the user's logbook field
    await User.findByIdAndUpdate(
      user._id,
      { $pull: { logbook: logbookItemId } },
      { new: true }
    );

    const updatedUser = await User.findById(user._id).populate("logbook");

    return {
      success: true,
      message: "Logbook item deleted successfully",
      action: "DELETED",
      logbook: updatedUser.logbook,
    };
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred while deleting the logbook item.");
  }
};

export default deleteLogbookItem;
