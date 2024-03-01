import { Collage, User } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

const unrepostCollage = async (_, { collageId }, { user }) => {
  try {
    isUser(user);

    const collage = await Collage.findById(collageId);
    if (!collage) {
      throw new Error("Collage not found.");
    }

    // Check if the user has already reposted the collage
    const existingRepost = await User.findOne({
      _id: user._id,
      repostedCollages: collageId,
    });

    if (!existingRepost) {
      throw new Error("Collage already reposted by the user.");
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
      success: true,
      message: "Collage un-reposted successfully.",
      action: "UNREPOST",
    };
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred during un-reposting the collage.");
  }
};

export default unrepostCollage;
