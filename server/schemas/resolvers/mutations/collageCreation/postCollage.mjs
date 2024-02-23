import { Collage, User } from "../../../../models/index.mjs";
import { isUser, isCurrentAuthor } from "../../../../utils/auth.mjs";

const postCollage = async (_, { collageId }, { user }) => {
  try {
    // Check if the user is authenticated
    isUser(user);

    // Retrieve the collage and check if the user is the author
    const collage = await Collage.findById(collageId);
    isCurrentAuthor(user, collage.author);

    // Check if the collage is in the user's logbook
    const isInLogbook = user.logbook.includes(collageId);

    // Remove the collage from the user's logbook if it's present
    if (isInLogbook) {
      await User.findByIdAndUpdate(
        user._id,
        { $pull: { logbook: collageId } },
        { new: true, runValidators: true }
      );
    }

    // Update the collage's post status and createdAt
    const updatedCollage = await Collage.findByIdAndUpdate(
      collageId,
      {
        $set: {
          posted: true,
          createdAt: new Date(),
        },
      },
      { new: true, runValidators: true }
    );

    return updatedCollage;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred while posting the collage.");
  }
};

export default postCollage;
