import { LifeListExperience } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

const removeShotFromExperience = async (
  _,
  { experienceId, shotId },
  { user }
) => {
  try {
    isUser(user);

    // Fetch the experience and ensure it exists and belongs to the user
    const experience = await LifeListExperience.findById(experienceId);
    if (!experience) {
      throw new Error("Experience not found.");
    }
    if (experience.lifeList.author.toString() !== user._id.toString()) {
      throw new Error("Not authorized to remove shots from this experience.");
    }

    // Remove the shot ID from the experience's associatedShots array
    await LifeListExperience.findByIdAndUpdate(
      experienceId,
      {
        $pull: { associatedShots: shotId },
      },
      { new: true }
    );

    return {
      success: true,
      message: "Shot removed from experience successfully.",
    };
  } catch (error) {
    console.error("Error removing shot from experience:", error);
    return {
      success: false,
      message: "Failed to remove shot from experience.",
    };
  }
};

export default removeShotFromExperience;
