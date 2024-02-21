import { CameraShot } from "../../../../models/index.mjs";
import { User } from "../../../../models/index.mjs";

export const getCameraAlbums = async (_, { userId }) => {
  try {
    const user = await User.findById(userId).populate("cameraAlbums");

    if (!user) {
      throw new Error("User not found.");
    }

    return user.cameraAlbums || [];
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

export const getCameraShots = async (_, { userId }) => {
  try {
    const user = await User.findById(userId).populate("cameraShots");

    if (!user) {
      throw new Error("User not found.");
    }

    return user.cameraShots || [];
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
