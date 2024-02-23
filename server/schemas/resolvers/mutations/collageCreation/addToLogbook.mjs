import { Collage, User } from "../../../../models/index.mjs";
import { isUser, isCurrentAuthor } from "../../../../utils/auth.mjs";

const addToLogbook = async (_, { collageId }, { user }) => {
  try {
    // Check if the user is authenticated
    isUser(user);

    // Retrieve the collage and check if the user is the author
    const collage = await Collage.findById(collageId);
    isCurrentAuthor(user, collage.author);

    // Add or remove the collage from the user's logbook
    const updatedUser = await User.findByIdAndUpdate(
      "65d73c129ef2e9c81aff5e9a",
      {
        $addToSet: {
          logbook: collageId,
        },
      },
      { new: true, runValidators: true }
    );

    return updatedUser;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred while updating the logbook status.");
  }
};

export default addToLogbook;
