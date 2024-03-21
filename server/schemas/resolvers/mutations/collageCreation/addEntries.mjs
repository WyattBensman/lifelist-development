import { Collage } from "../../../../models/index.mjs";
import { isUser, isCurrentAuthor } from "../../../../utils/auth.mjs";

const addEntries = async (_, { collageId, entries }, { user }) => {
  try {
    isUser(user);
    await isCurrentAuthor(user, collageId);

    // Update the collage with the provided summary
    const updatedCollage = await Collage.findByIdAndUpdate(
      collageId,
      { entries },
      { new: true }
    );

    return {
      success: true,
      message: "Entries added successfully",
      collageId: collageId,
      entries: updatedCollage.entries,
    };
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred during adding summary.");
  }
};

export default addEntries;
