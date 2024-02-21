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
    if (collage.reposts.includes(user.id)) {
      throw new Error("Collage already reposted by the user.");
    }

    // Add the user to the reposts array
    collage.reposts.push(user.id);
    await collage.save();

    // Add the collage to the user's repostedCollages
    await User.findByIdAndUpdate(
      user.id,
      { $push: { repostedCollages: collage.id } },
      { new: true }
    );

    return {
      message: "Collage reposted successfully.",
    };
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred during reposting the collage.");
  }
};

export default repostCollage;
