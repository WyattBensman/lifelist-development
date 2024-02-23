import { Collage, User } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

const repostCollage = async (_, { collageId }, { user }) => {
  try {
    isUser(user);

    const collage = await Collage.findById(collageId);
    if (!collage) {
      throw new Error("Collage not found.");
    }

    // Check if the user has already reposted the collage
    const isAlreadyReposted = user.repostedCollages.includes(collageId);
    if (isAlreadyReposted) {
      throw new Error("Collage already reposted by the user.");
    }

    // Add the collage to the user's repostedCollages
    await User.findByIdAndUpdate(
      user._id,
      { $push: { repostedCollages: collageId } },
      { new: true }
    );

    // Add the user to the collage's reposts
    await Collage.findByIdAndUpdate(
      collageId,
      { $push: { reposts: user._id } },
      { new: true }
    );

    return {
      message: "Collage reposted successfully.",
    };

    return {
      message: "Collage reposted successfully.",
    };
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred during reposting the collage.");
  }
};

export default repostCollage;
