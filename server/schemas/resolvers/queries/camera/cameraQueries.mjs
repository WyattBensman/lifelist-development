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

  const currentUser = await User.findById(user).exec();
  if (!currentUser) throw new Error("User not found.");

  const albums = await CameraAlbum.find({ author: currentUser })
    .select("_id title coverImage shotsCount")
    .exec();

  return albums;
};

export const getCameraAlbum = async (_, { albumId }) => {
  const cameraAlbum = await CameraAlbum.findById(albumId)
    .populate({
      path: "shots",
      select: "_id capturedAt imageThumbnail", // Specify only the required fields
    })
    .exec();

  if (!cameraAlbum) throw new Error("Camera album not found.");

  return cameraAlbum;
};

export const getAllCameraShots = async (
  _,
  { cursor, limit = 12 },
  { user }
) => {
  isUser(user); // Ensure the user is authenticated

  // Fetch the user and populate the camera shots
  const currentUser = await User.findById(user)
    .populate({
      path: "cameraShots",
      match: {
        ...(cursor && { _id: { $gt: cursor } }), // Apply cursor filter if provided
      },
      options: {
        sort: { _id: 1 }, // Sort by _id in ascending order
        limit: limit + 1, // Fetch one extra record to check for the next page
      },
      select: "_id capturedAt imageThumbnail", // Select only required fields
    })
    .exec();

  if (!currentUser) throw new Error("User not found.");

  const cameraShots = currentUser.cameraShots;

  // Determine if there are more pages
  const hasNextPage = cameraShots.length > limit;
  if (hasNextPage) cameraShots.pop(); // Remove the extra record for pagination

  return {
    shots: cameraShots,
    nextCursor: hasNextPage ? cameraShots[cameraShots.length - 1]._id : null,
    hasNextPage,
  };
};

export const getCameraShot = async (_, { shotId }) => {
  const cameraShot = await CameraShot.findById(shotId).exec();
  if (!cameraShot) throw new Error("Camera shot not found.");
  return cameraShot;
};

export const getDevelopingCameraShots = async (_, __, { user }) => {
  isUser(user);

  const currentUser = await User.findById(user)
    .populate({
      path: "developingCameraShots",
      select:
        "_id imageThumbnail capturedAt developingTime isDeveloped readyToReviewAt transferredToRoll",
    })
    .exec();

  if (!currentUser) throw new Error("User not found.");

  return currentUser.developingCameraShots.filter(
    (shot) => !shot.transferredToRoll
  );
};
