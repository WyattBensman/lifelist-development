export const getCollageById = async (_, { collageId }) => {
  try {
    const collage = await Collage.findById(collageId);
    if (!collage) {
      throw new Error("Collage not found.");
    }
    return collage;
  } catch (error) {
    throw new Error(`Error fetching collage by ID: ${error.message}`);
  }
};
