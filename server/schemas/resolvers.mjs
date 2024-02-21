import {
  getUserById,
  searchUsers,
  getUserFollowers,
  getUserFollowing,
  getUserCollages,
  getUserReposts,
  getUserSavedCollages,
  getUserTaggedCollages,
  getUserLifeList,
  getUserLogbook,
  getUserArchives,
  getUserNotifications,
  getUserFollowRequest,
  getUserConversations,
  getConversationMessages,
  getUnreadMessagesCount,
  getExperience,
  getCollageById,
  getCollageMedia,
  getCollageSummary,
  getCollageComments,
  getCollageTaggedUsers,
  getAllCameraAlbums,
  getCameraAlbum,
  getAllCameraShots,
  getCameraShot,
} from "./resolvers/queries/index.mjs";
import mutations from "./resolvers/mutations/index.mjs";

const resolvers = {
  Query: {
    // User queries
    getUserById,
    searchUsers,
    getUserFollowers,
    getUserFollowing,
    getUserCollages,
    getUserReposts,
    getUserSavedCollages,
    getUserTaggedCollages,
    getUserLifeList,
    getUserLogbook,
    getUserArchives,

    // Notification queries
    getUserNotifications,
    getUserFollowRequest,

    // Messaging queries
    getUserConversations,
    getConversationMessages,
    getUnreadMessagesCount,

    // Experience queries
    getExperience,

    // Collage queries
    getCollageById,
    getCollageMedia,
    getCollageSummary,
    getCollageComments,
    getCollageTaggedUsers,

    // Camera queries
    getAllCameraAlbums,
    getCameraAlbum,
    getAllCameraShots,
    getCameraShot,
  },
  Mutation: {
    ...mutations,
  },
};

export default resolvers;
