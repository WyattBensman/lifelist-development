import { User } from "../../../../../models/index.mjs";

export const getUser = async (_, { userId }) => {
  try {
    const user = await User.findById(userId);

    return user;
  } catch (error) {
    throw new Error(`Error fetching user: ${error.message}`);
  }
};

/* User Queries */
getUserById;
getUserByUsername;
getUserFollowers;
getUserFollowing;
getUserCollages;
getUserReposts;
getUserTaggedCollages;
getUserLifeList;
getUserLogbook;
getUserArchives;
getUserCameraShots;
getUserCameraAlbums;

/* Collage Queries */
getCollageById;
getCollageComments;
getCollageTaggedUsers;

/* Camera Queries */
getCameraShotById;
