import { Collage, User } from "../../../../models/index.mjs";
import { isUser, isCurrentAuthor } from "../../../../utils/auth.mjs";

const addToLogbook = async (_, { collageId }, { user }) => {
  try {
    /* isUser(user);
    await isCurrentAuthor(user, collageId); */

    // Add or remove the collage from the user's logbook
    const updatedUser = await User.findByIdAndUpdate(
      "65e08edb5242a6c8ff3c8152",
      {
        $addToSet: {
          logbook: collageId,
        },
      },
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
