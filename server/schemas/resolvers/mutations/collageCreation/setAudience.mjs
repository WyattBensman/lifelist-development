import { Collage } from "../../../../models/index.mjs";
import { isUser, isCurrentAuthor } from "../../../../utils/auth.mjs";

const setAudience = async (_, { collageId, audience }, { user }) => {
  try {
    isUser(user);
    await isCurrentAuthor(user, collageId);

    // Validate the audience value
    const validAudiences = ["PUBLIC", "FRIENDS", "TAGGED", "PRIVACY_GROUP"];
    if (!validAudiences.includes(audience)) {
      throw new Error("Invalid audience type.");
    }

    // Update the audience field of the collage
    const updatedCollage = await Collage.findByIdAndUpdate(
      collageId,
      { audience },
      { new: true }
    );

    return {
      success: true,
      message: "Audience set successfully",
      collageId: updatedCollage._id,
    };
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred during audience set.");
  }
};

export default setAudience;
