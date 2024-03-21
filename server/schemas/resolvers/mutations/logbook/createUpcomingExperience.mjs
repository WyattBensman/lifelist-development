import { LogbookItem, User } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

const createUpcomingExperience = async (
  _,
  { title, date, startDate, endDate, month },
  { user }
) => {
  try {
    // Check authentication
    isUser(user);

    if (!title || (!date && !(startDate && endDate) && !month)) {
      throw new Error(
        "Title and at least one of date, startDate/endDate, or month are required."
      );
    }

    // Create a new LogbookItem
    const newLogbookItem = await LogbookItem.create({
      author: user._id,
      title,
      startDate: startDate || null,
      endDate: endDate || null,
      date: date || null,
      month: month || null,
    });

    const updatedUser = await User.findById(user._id).populate("logbook");

    return {
      success: true,
      message: "Upcoming experience added successfully",
      action: "ADDED",
      logbook: updatedUser.logbook,
    };
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error(
      "An error occurred while creating the upcoming experience."
    );
  }
};

export default createUpcomingExperience;
