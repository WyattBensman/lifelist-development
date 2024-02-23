import { Collage } from "../../../../models/index.mjs";
import { isUser, isCurrentAuthor } from "../../../../utils/auth.mjs";

const archiveCollage = async (_, { collageId }, { user }) => {
  try {
    // Check if the user is authenticated
    /* isUser(user); */

    // Retrieve the collage and check if the user is the author
    /* const collage = await Collage.findById(collageId);
    isCurrentAuthor(user, collage.author); */

    // Archive the collage
    await Collage.findByIdAndUpdate(collageId, { archived: true });

    return "Collage archived successfully.";
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred while archiving the collage.");
  }
};

export default archiveCollage;
