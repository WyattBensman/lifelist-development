import { CameraShot, User } from "../../../../models/index.mjs";

const transferCameraShot = async (_, { shotId }, { user }) => {
  isUser(user);

  const cameraShot = await CameraShot.findById(shotId);
  if (!cameraShot) throw new Error("Camera shot not found.");
  if (!cameraShot.isDeveloped)
    throw new Error("Shot is not yet ready for review.");

  await User.findByIdAndUpdate(user, {
    $pull: { developingCameraShots: shotId },
    $addToSet: { cameraShots: shotId },
  });

  cameraShot.transferredToRoll = true;
  await cameraShot.save();

  return {
    success: true,
    message: "Camera shot transferred to camera shots.",
  };
};

export default transferCameraShot;
