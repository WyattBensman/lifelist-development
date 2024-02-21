import { User, CameraShot, CameraAlbum } from "../../../../models/index.mjs";

export const getAllCameraAlbums = async (_, __, { user }) => {
  // Check if the user is authenticated
  isUser(user);

  try {
    const currentUser = await User.findById(user.id).populate("cameraAlbums");

    if (!currentUser) {
      throw new Error("User not found.");
    }

    return currentUser.cameraAlbums;
  } catch (error) {
    throw new Error(`Error fetching camera albums: ${error.message}`);
  }
};

export const getCameraAlbum = async (_, { albumId }) => {
  try {
    const cameraAlbum = await CameraAlbum.findById(albumId).populate("shots");

    if (!cameraAlbum) {
      throw new Error("Camera album not found.");
    }

    return cameraAlbum;
  } catch (error) {
    throw new Error(`Error fetching camera album: ${error.message}`);
  }
};

export const getAllCameraShots = async (_, __, { user }) => {
  // Check if the user is authenticated
  isUser(user);

  try {
    const currentUser = await User.findById(user.id).populate("cameraShots");

    if (!currentUser) {
      throw new Error("User not found.");
    }

    return currentUser.cameraShots;
  } catch (error) {
    throw new Error(`Error fetching camera shots: ${error.message}`);
  }
};

export const getCameraShot = async (_, { shotId }) => {
  try {
    const cameraShot = await CameraShot.findById(shotId);

    if (!cameraShot) {
      throw new Error("Camera shot not found.");
    }

    return cameraShot;
  } catch (error) {
    throw new Error(`Error fetching camera shot: ${error.message}`);
  }
};
