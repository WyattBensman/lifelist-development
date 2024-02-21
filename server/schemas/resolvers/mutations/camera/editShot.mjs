import { CameraShot, User } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

const editShot = async (_, { shotId, orientation, filter }, { user }) => {
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

    // Edit the shot
    if (orientation !== undefined) {
      shot.orientation = orientation;
    }

    if (filter !== undefined) {
      shot.filtered = filter;
    }

    await shot.save();

    return shot;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred while editing the shot.");
  }
};

export default editShot;
