import { Collage } from "../../../../models/index.mjs";
import { isUser, isCurrentAuthor } from "../../../../utils/auth.mjs";

const setCaption = async (_, { collageId, caption }, { user }) => {
  try {
    isUser(user);
    await isCurrentAuthor(user, collageId);

    // Update the collage with the provided title and caption
    const updatedCollage = await Collage.findByIdAndUpdate(
      collageId,
      { caption },
      { new: true }
    );

    return {
      success: true,
      message: "Description added successfully",
      collageId: updatedCollage._id,
      caption: updatedCollage.caption,
    };
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred during adding description.");
  }
};

export default setCaption;
