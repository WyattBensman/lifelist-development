import { LifeListExperience, CameraShot } from "../../../../models/index.mjs";

const updateAssociatedShots = async (_, { lifeListExperienceId, shotIds }) => {
  try {
    // Fetch the CameraShot documents for the given shotIds
    const cameraShots = await CameraShot.find({ _id: { $in: shotIds } });

    // Create the associatedShots array with embedded CameraShot documents
    const associatedShots = cameraShots.map((shot) => ({
      shot,
      isHidden: false,
    }));

    // Update the LifeListExperience with the fetched CameraShot documents
    const updatedExperience = await LifeListExperience.findByIdAndUpdate(
      lifeListExperienceId,
      { associatedShots },
      { new: true }
    );

    return {
      success: true,
      message: "Associated shots updated successfully",
    };
  } catch (error) {
    console.error(`Error updating shots to LifeList: ${error.message}`);
    throw new Error("Failed to update shots to LifeList.");
  }
};

export default updateAssociatedShots;
