import { Collage } from "../../../../models/index.mjs";
import { isUser, isCurrentAuthor } from "../../../../utils/auth.mjs";

const setDate = async (_, { collageId, date }, { user }) => {
  try {
    // Check if the user is authenticated
    /* isUser(user); */

    // Retrieve the collage and check if the user is the author
    /* const collage = await Collage.findById(collageId);
    isCurrentAuthor(user, collage.author); */

    // Validate that either startDate and finishDate go together or month is provided
    if ((startDate || finishDate) && month) {
      throw new Error(
        "Provide either startDate and finishDate or month, not both."
      );
    }

    // Update date for the collage
    const updatedCollage = await Collage.findByIdAndUpdate(
      collageId,
      {
        startDate,
        finishDate,
        month,
      },
      { new: true }
    );

    return updatedCollage;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred while setting the date.");
  }
};

export default setDate;
