import { Collage } from "../../../../models/index.mjs";
import { isUser, isCurrentAuthor } from "../../../../utils/auth.mjs";

const removeExperiences = async (_, { collageId, experienceIds }, { user }) => {
  try {
    // Check if the user is authenticated
    isUser(user);

    // Retrieve the collage and check if the user is the author
    const collage = await Collage.findById(collageId);
    isCurrentAuthor(user, collage.author);

    // Update the collage and remove the specified experiences
    const updatedCollage = await Collage.findByIdAndUpdate(
      collageId,
      { $pullAll: { experiences: experienceIds } },
      { new: true }
    ).populate({
      path: "experiences",
      select: "title image location category",
    });

    return updatedCollage;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred during removing experiences.");
  }
};

export default removeExperiences;
