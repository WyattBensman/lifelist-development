import { Collage, User } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

export const unrepostCollage = async (_, { collageId }, { user }) => {
  try {
    isUser(user);

    const collage = await Collage.findById(collageId);
    if (!collage) {
      throw new Error("Collage not found.");
    }

    // Check if the user has reposted the collage
    if (!collage.reposts.includes(user.id)) {
      throw new Error("Collage not reposted by the user.");
    }

    // Remove the user from the reposts array
    collage.reposts = collage.reposts.filter((userId) => userId !== user.id);
    await collage.save();

    // Remove the collage from the user's repostedCollages
    await User.findByIdAndUpdate(
      user.id,
      { $pull: { repostedCollages: collage.id } },
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
