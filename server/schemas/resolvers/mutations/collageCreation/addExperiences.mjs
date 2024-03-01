import { Collage } from "../../../../models/index.mjs";
import { isUser, isCurrentAuthor } from "../../../../utils/auth.mjs";

const addExperiences = async (_, { collageId, experienceIds }, { user }) => {
  try {
    // Check if the user is authenticated
    isUser(user);

    // Check if the user is the author
    await isCurrentAuthor(user, collageId);

    // Update the collage with the provided experiences
    const updatedCollage = await Collage.findByIdAndUpdate(
      collageId,
      { $addToSet: { experiences: { $each: experienceIds } } },
      { new: true }
    ).populate({
      path: "experiences",
      select: "title image location category",
    });

    return {
      success: true,
      message: "Experiences added successfully",
      collageId: collageId,
      experiences: updatedCollage.experiences,
    };
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred during adding experiences.");
  }
};

export default addExperiences;
