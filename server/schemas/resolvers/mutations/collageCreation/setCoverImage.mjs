import { Collage } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

const setCoverImage = async (_, { collageId, selectedImage }, { user }) => {
  try {
    isUser(user);

    // Check if the selected image exists in the collage's images array
    const collage = await Collage.findById(collageId);
    if (!collage.images.includes(selectedImage)) {
      throw new Error("Selected image not found in the collage.");
    }

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
