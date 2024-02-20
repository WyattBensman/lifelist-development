import { CameraShot, User } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";
import { apply35mmFilter } from "../../../../utils/cameraUtils.mjs";

export const takeCameraShot = async (
  _,
  { filter, shotOrientation },
  { user }
) => {
  try {
    isUser(user);

    // Check if the user has reached the daily limit
    if (user.dailyCameraShots.count >= 10) {
      throw new Error("Daily camera shot limit reached");
    }

    // Capture the camera shot (Assuming you have the captured image URI)
    let capturedImageUri = "path/to/captured/image.jpg";

    // Apply 35mm filter if needed
    if (filter) {
      const filteredImagePath = "path/to/filtered/image.jpg";
      await apply35mmFilter(capturedImageUri, filteredImagePath);
      capturedImageUri = filteredImagePath;
    }

    // Create a new CameraShot instance
    const newCameraShot = await CameraShot.create({
      author: user.id,
      image: capturedImageUri,
      capturedAt: new Date(),
      filtered: !!filter,
      shotOrientation: shotOrientation,
    });

    // Update user's dailyCameraShots count
    await User.findByIdAndUpdate(
      user.id,
      {
        $inc: { "dailyCameraShots.count": 1 },
        "dailyCameraShots.lastReset": new Date(),
      },
      { new: true }
    );

    return {
      message: "Camera shot captured successfully.",
      cameraShot: newCameraShot,
    };
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred during camera shot capture.");
  }
};
