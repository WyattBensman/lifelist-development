import {
  LifeList,
  LifeListExperience,
  CameraShot,
  Collage,
} from "../../../../models/index.mjs"; // Ensure you import necessary models
import { isLifeListAuthor } from "../../../../utils/auth.mjs";

const addExperienceToLifeList = async (
  _,
  { lifeListId, experienceId, list, associatedShots, associatedCollages },
  { user }
) => {
  try {
    // Verify if the user is authorized to modify the specified LifeList
    /* await isLifeListAuthor(user, lifeListId); */

    // Fetch the existing LifeList to check current experiences
    const lifeList = await LifeList.findById(lifeListId).populate(
      "experiences"
    );
    if (!lifeList) {
      throw new Error("LifeList not found.");
    }

    // Check if the experience is already in the LifeList
    const existingExperienceIds = new Set(
      lifeList.experiences.map((exp) => exp.experience.toString())
    );

    if (existingExperienceIds.has(experienceId)) {
      throw new Error("Experience is already in the LifeList.");
    }

    // Validate and transform associatedShots and associatedCollages
    const validAssociatedShots = await CameraShot.find({
      _id: { $in: associatedShots },
    });
    const validAssociatedCollages = await Collage.find({
      _id: { $in: associatedCollages },
    });

    // Create a new LifeListExperience document
    const lifeListExperience = await LifeListExperience.create({
      lifeList: lifeListId,
      experience: experienceId,
      list,
      associatedShots: validAssociatedShots.map((shot) => shot._id),
      associatedCollages: validAssociatedCollages.map((collage) => collage._id),
    });

    // Append the new experience to the LifeList
    lifeList.experiences.push(lifeListExperience._id);
    await lifeList.save();

    return {
      success: true,
      message: "Experience successfully added to LifeList.",
    };
  } catch (error) {
    console.error(`Error adding experience to LifeList: ${error.message}`);
    throw new Error("Failed to add experience to LifeList.");
  }
};

export default addExperienceToLifeList;
