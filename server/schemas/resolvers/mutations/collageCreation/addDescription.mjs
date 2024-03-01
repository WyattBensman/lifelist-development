import { Collage } from "../../../../models/index.mjs";
import { isUser, isCurrentAuthor } from "../../../../utils/auth.mjs";

const addDescription = async (_, { collageId, title, caption }, { user }) => {
  try {
    // Check if the user is authenticated
    isUser(user);

    // Check if the user is the author
    await isCurrentAuthor(user, collageId);

    // Update the collage with the provided title and caption
    const updatedCollage = await Collage.findByIdAndUpdate(
      collageId,
      { title, caption },
      { new: true }
    );

    return {
      success: true,
      message: "Description added successfully",
      collageId: updatedCollage._id,
      title: updatedCollage.title,
      caption: updatedCollage.caption,
    };
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred during adding description.");
  }
};

export default addDescription;
