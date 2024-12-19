import { Moment, CameraShot, User } from "../../../../models/index.mjs";

export const postMoment = async (_, { cameraShotId }, { user }) => {
  if (!user) {
    throw new Error("Unauthorized");
  }

  try {
    const cameraShot = await CameraShot.findById(cameraShotId);
    if (!cameraShot) {
      throw new Error("CameraShot not found.");
    }

    const createdAt = new Date();
    const expiresAt = new Date(createdAt.getTime() + 24 * 60 * 60 * 1000); // 24 hours from creation

    // Create the new moment
    const newMoment = await Moment.create({
      author: user,
      cameraShot: cameraShot._id,
      createdAt,
      expiresAt,
    });

    // Add the moment to the user's `moments` field
    await User.findByIdAndUpdate(
      user,
      { $push: { moments: newMoment._id } }, // Add the new moment ID to the user's moments array
      { new: true }
    );

    return {
      _id: newMoment._id,
      createdAt: newMoment.createdAt,
      expiresAt: newMoment.expiresAt,
      success: true,
      message: "Moment successfully posted.",
    };
  } catch (error) {
    console.error("Error posting moment:", error.message);
    throw new Error("Failed to post moment.");
  }
};
