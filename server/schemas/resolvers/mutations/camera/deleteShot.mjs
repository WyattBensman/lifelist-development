import { CameraShot, User } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

export const deleteShot = async (_, { shotId }, { user }) => {
  try {
    isUser(user);

    // Check if the user owns the shot
    const shot = await CameraShot.findOne({
      _id: shotId,
      author: user.id,
    });

    if (!shot) {
      throw new Error("Shot not found or user does not own the shot.");
    }

    // Remove the shot from the user's cameraShots array
    await User.findByIdAndUpdate(
      user.id,
      { $pull: { cameraShots: shotId } },
      { new: true }
    );

    // Delete the shot
    await CameraShot.findByIdAndDelete(shotId);

    return {
      message: "Shot deleted successfully.",
      shot,
    };
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred while deleting the shot.");
  }
};
