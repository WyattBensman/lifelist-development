import { Collage } from "../../../../models/index.mjs";
import { isUser, isCurrentAuthor } from "../../../../utils/auth.mjs";

export const addExperiences = async (
  _,
  { collageId, experienceIds },
  { user }
) => {
  try {
    // Check if the user is authenticated
    isUser(user);

    // Retrieve the collage and check if the user is the author
    const collage = await Collage.findById(collageId);
    isCurrentAuthor(user, collage.author);

    // Update the collage with the provided experiences
    const updatedCollage = await Collage.findByIdAndUpdate(
      collageId,
      { $addToSet: { experiences: { $each: experienceIds } } },
      { new: true }
    );

    return updatedCollage;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred during adding experiences.");
  }
};
