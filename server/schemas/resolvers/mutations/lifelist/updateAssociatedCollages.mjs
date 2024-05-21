import { LifeListExperience } from "../../../../models/index.mjs";

const updateAssociatedCollages = async (
  _,
  { lifeListExperienceId, collageIds }
) => {
  try {
    await LifeListExperience.findByIdAndUpdate(
      lifeListExperienceId,
      { associatedCollages: collageIds },
      { new: true }
    );
    return {
      success: true,
      message: "Associated collages updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to update associated collages",
    };
  }
};

export default updateAssociatedCollages;
