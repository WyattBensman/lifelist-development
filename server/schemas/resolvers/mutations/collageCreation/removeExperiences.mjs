import { Collage } from "../../../../models/index.mjs";
import { isUser, isCurrentAuthor } from "../../../../utils/auth.mjs";

const removeExperiences = async (_, { collageId, experienceIds }, { user }) => {
  try {
    isUser(user);
    await isCurrentAuthor(user, collageId);

    // Update the collage and remove the specified experiences
    const updatedCollage = await Collage.findByIdAndUpdate(
      collageId,
      { $pullAll: { experiences: experienceIds } },
      { new: true }
    ).populate({
      path: "experiences",
      select: "title image location category",
    });

    return {
      success: true,
      message: "Experiences removed successfully",
      collageId: collageId,
      experiences: updatedCollage.experiences,
    };
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred during removing experiences.");
  }
};

export default removeExperiences;
