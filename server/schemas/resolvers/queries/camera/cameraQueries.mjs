import { User, CameraShot, CameraAlbum } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

export const getDailyCameraShotsLeft = async (_, __, { user }) => {
  isUser(user);
  const currentUser = await User.findById(user).exec();
  if (!currentUser) throw new Error("User not found.");

  return currentUser.shotsLeft;
};

export const getAllCameraAlbums = async (_, __, { user }) => {
  isUser(user);
  const currentUser = await User.findById(user).populate("cameraAlbums").exec();
  if (!currentUser) throw new Error("User not found.");
  return currentUser.cameraAlbums;
};

export const getCameraAlbum = async (_, { albumId }) => {
  const cameraAlbum = await CameraAlbum.findById(albumId)
    .populate("shots")
    .exec();
  if (!cameraAlbum) throw new Error("Camera album not found.");
  return cameraAlbum;
};

export const getAllCameraShots = async (_, __, { user }) => {
  isUser(user);
  const currentUser = await User.findById(user).populate("cameraShots").exec();
  if (!currentUser) throw new Error("User not found.");
  return currentUser.cameraShots;
};

export const getCameraShot = async (_, { shotId }) => {
  const cameraShot = await CameraShot.findById(shotId).exec();
  if (!cameraShot) throw new Error("Camera shot not found.");
  return cameraShot;
};

export const getDevelopingCameraShots = async (_, __, { user }) => {
  isUser(user);

  const currentUser = await User.findById(user)
    .populate("developingCameraShots")
    .exec();

  if (!currentUser) throw new Error("User not found.");

  // Filter out only developing shots that haven't been transferred to the roll yet
  const developingShots = currentUser.developingCameraShots.filter(
    (shot) => !shot.transferredToRoll
  );

  return developingShots;
};
