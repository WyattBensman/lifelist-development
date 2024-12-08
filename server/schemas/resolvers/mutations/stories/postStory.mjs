import { Story, CameraShot, User } from "../../../../models/index.mjs";

export const postStory = async (_, { cameraShotId }, { user }) => {
  if (!user) {
    throw new Error("Unauthorized");
  }

  try {
    const cameraShot = await CameraShot.findById(cameraShotId);
    if (!cameraShot) {
      throw new Error("CameraShot not found.");
    }

    const createdAt = new Date();
    const expiresAt = new Date(createdAt.getTime() + 24 * 60 * 60 * 1000);

    // Create the new story
    const newStory = await Story.create({
      author: user,
      cameraShot: cameraShot._id,
      createdAt,
      expiresAt,
    });

    // Add the story to the user's `stories` field
    await User.findByIdAndUpdate(
      user,
      { $push: { stories: newStory._id } },
      { new: true } // Return the updated document
    );

    return {
      success: true,
      message: "Story successfully posted.",
    };
  } catch (error) {
    console.error("Error posting story:", error.message);
    throw new Error("Failed to post story.");
  }
};
