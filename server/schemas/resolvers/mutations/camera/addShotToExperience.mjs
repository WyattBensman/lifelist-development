import { LifeListExperience } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

const addShotToExperience = async (_, { experienceId, shotId }, { user }) => {
  try {
    isUser(user);

    // Fetch the experience and ensure it exists and belongs to the user
    const experience = await LifeListExperience.findById(experienceId);
    if (!experience) {
      throw new Error("Experience not found.");
    }
    if (experience.lifeList.author.toString() !== user._id.toString()) {
      throw new Error("Not authorized to add shots to this experience.");
    }

    // Add the shot ID to the experience's associatedShots array using $addToSet to prevent duplicates
    await LifeListExperience.findByIdAndUpdate(
      experienceId,
      {
        $addToSet: { associatedShots: shotId },
      },
      { new: true }
    );

    return { success: true, message: "Shot added to experience successfully." };
  } catch (error) {
    console.error("Error adding shot to experience:", error);
    return { success: false, message: "Failed to add shot to experience." };
  }
};

export default addShotToExperience;
