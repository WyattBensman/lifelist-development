import { User, CameraShot, CameraAlbum } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

export const getAllCameraAlbums = async (_, __, { user }) => {
  isUser(user);

  const currentUser = await User.findById(user).exec();
  if (!currentUser) throw new Error("User not found.");

  const albums = await CameraAlbum.find({ author: currentUser })
    .select("_id title coverImage shotsCount")
    .populate("shots", "_id") // Populate the shots field with only the _id
    .exec();

  // Transform the albums to include the array of shot IDs
  const transformedAlbums = albums.map((album) => ({
    _id: album._id,
    title: album.title,
    coverImage: album.coverImage,
    shotsCount: album.shotsCount,
    shots: album.shots.map((shot) => ({ _id: shot._id })), // Map to an array of IDs
  }));

  return transformedAlbums;
};

export const getCameraAlbum = async (_, { albumId, cursor, limit = 12 }) => {
  // Find the camera album by ID
  const cameraAlbum = await CameraAlbum.findById(albumId)
    .populate({
      path: "shots",
      match: {
        ...(cursor && { _id: { $gt: cursor } }), // Apply cursor filter if provided
      },
      options: {
        sort: { _id: 1 }, // Sort by _id in ascending order
        limit: limit + 1, // Fetch one extra record to determine hasNextPage
      },
      select: "_id capturedAt imageThumbnail", // Select only required fields
    })
    .exec();

  if (!cameraAlbum) throw new Error("Camera album not found.");

  const shots = cameraAlbum.shots;

  // Determine if there are more pages
  const hasNextPage = shots.length > limit;
  if (hasNextPage) shots.pop(); // Remove the extra record for pagination

  return {
    album: {
      _id: cameraAlbum._id,
      title: cameraAlbum.title,
      coverImage: cameraAlbum.coverImage,
    },
    shots,
    nextCursor: hasNextPage ? shots[shots.length - 1]._id : null,
    hasNextPage,
  };
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
      select: "_id capturedAt image imageThumbnail", // Select only required fields
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
  try {
    const cameraShot = await CameraShot.findById(
      shotId,
      "_id image capturedAt"
    ).exec();

    if (!cameraShot) {
      throw new Error("Camera shot not found.");
    }

    return cameraShot;
  } catch (error) {
    console.error("Error fetching camera shot:", error);
    throw new Error("Failed to fetch camera shot.");
  }
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
