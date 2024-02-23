import { Collage, User } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

const unrepostCollage = async (_, { collageId }, { user }) => {
  try {
    isUser(user);

    const collage = await Collage.findById(collageId);
    if (!collage) {
      throw new Error("Collage not found.");
    }

    // Remove the collage from the user's repostedCollages
    await User.findByIdAndUpdate(
      user._id,
      { $pull: { repostedCollages: collageId } },
      { new: true }
    );

    // Remove the user from the collage's reposts
    await Collage.findByIdAndUpdate(
      collageId,
      { $pull: { reposts: user._id } },
      { new: true }
    );

    return {
      message: "Collage un-reposted successfully.",
    };
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred during un-reposting the collage.");
  }
};

export default unrepostCollage;
