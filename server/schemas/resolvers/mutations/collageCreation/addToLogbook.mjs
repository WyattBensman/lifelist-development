import { Collage, User } from "../../../../models/index.mjs";
import { isUser, isCurrentAuthor } from "../../../../utils/auth.mjs";

const addToLogbook = async (_, { collageId }, { user }) => {
  try {
    // Check if the user is authenticated
    isUser(user);

    // Retrieve the collage and check if the user is the author
    const collage = await Collage.findById(collageId);
    isCurrentAuthor(user, collage.author);

    // Toggle the isInLogbook field
    const updatedCollage = await Collage.findByIdAndUpdate(
      collageId,
      { $set: { isInLogbook: !collage.isInLogbook } },
      { new: true, runValidators: true }
    );

    return updatedCollage;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred while updating the logbook status.");
  }
};

export default addToLogbook;
