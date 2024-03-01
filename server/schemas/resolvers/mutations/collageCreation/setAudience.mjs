import { Collage } from "../../../../models/index.mjs";
import { isUser, isCurrentAuthor } from "../../../../utils/auth.mjs";

const setAudience = async (_, { collageId, audience }, { user }) => {
  try {
    // Check if the user is authenticated
    isUser(user);

    // Check if the user is the author
    await isCurrentAuthor(user, collageId);

    // Update audience for the collage
    const updatedCollage = await Collage.findByIdAndUpdate(
      collageId,
      {
        $set: {
          audience: audience.map(({ privacyGroupId }) => privacyGroupId),
        },
      },
      { new: true, runValidators: true }
    );

    return {
      success: true,
      message: "Audience set successfully",
      collageId: collageId,
    };
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred while setting the audience.");
  }
};

export default setAudience;
