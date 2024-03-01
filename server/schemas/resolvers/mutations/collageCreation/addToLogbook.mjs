import { Collage, User } from "../../../../models/index.mjs";
import { isUser, isCurrentAuthor } from "../../../../utils/auth.mjs";

const addToLogbook = async (_, { collageId }, { user }) => {
  try {
    // Check if the user is authenticated
    isUser(user);

    // Check if the user is the author
    await isCurrentAuthor(user, collageId);

    // Add or remove the collage from the user's logbook
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
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
      collageId: collageId,
      logBook: updatedCollage.logBook,
    };
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred while updating the logbook status.");
  }
};

export default addToLogbook;
