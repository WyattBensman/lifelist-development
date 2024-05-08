import { Collage } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

const setCoverImage = async (_, { collageId, selectedImage }, { user }) => {
  try {
    isUser(user);
    await isCurrentAuthor(user, collageId);

    // Update the coverImage field
    await Collage.findByIdAndUpdate(collageId, { coverImage: selectedImage });

    return {
      success: true,
      message: "Cover image set successfully",
      collageId: collageId,
    };
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred during cover image set.");
  }
};

export default setCoverImage;
