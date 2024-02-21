import { Collage } from "../../../../models/index.mjs";
import { isUser, isCurrentAuthor } from "../../../../utils/auth.mjs";

const addDescription = async (_, { collageId, title, caption }, { user }) => {
  try {
    // Check if the user is authenticated
    isUser(user);

    // Retrieve the collage and check if the user is the author
    const collage = await Collage.findById(collageId);
    isCurrentAuthor(user, collage.author);

    // Update the collage with the provided title and caption
    const updatedCollage = await Collage.findByIdAndUpdate(
      collageId,
      { title, caption },
      { new: true }
    );

    return updatedCollage;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred during adding description.");
  }
};

export default addDescription;
