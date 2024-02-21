import { Collage } from "../../../../models/index.mjs";
import { isUser, isCurrentAuthor } from "../../../../utils/auth.mjs";

const setLocation = async (_, { collageId, locations }, { user }) => {
  try {
    // Check if the user is authenticated
    isUser(user);

    // Retrieve the collage and check if the user is the author
    const collage = await Collage.findById(collageId);
    isCurrentAuthor(user, collage.author);

    // Update locations for the collage
    const updatedCollage = await Collage.findByIdAndUpdate(
      collageId,
      { $set: { locations } },
      { new: true, runValidators: true }
    );

    return updatedCollage;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred while setting the locations.");
  }
};

export default setLocation;
