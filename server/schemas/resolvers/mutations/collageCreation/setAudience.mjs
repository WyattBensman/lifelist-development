import { Collage } from "../../../../models/index.mjs";
import { isUser, isCurrentAuthor } from "../../../../utils/auth.mjs";

const setAudience = async (_, { collageId, audience }, { user }) => {
  try {
    isUser(user);
    await isCurrentAuthor(user, collageId);

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
