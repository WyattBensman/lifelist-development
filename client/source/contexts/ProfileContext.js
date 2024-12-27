import React, { createContext, useContext, useState, useEffect } from "react";
import { saveImageToFileSystem, getImageFromFileSystem } from "./cacheHelper";
import { GET_USER_PROFILE } from "./queries";
import {
  FOLLOW_USER,
  UNFOLLOW_USER,
  SEND_FOLLOW_REQUEST,
  UNSEND_FOLLOW_REQUEST,
} from "../utils/mutations";
import { client } from "./apolloClient";
import * as FileSystem from "expo-file-system";

// Thumbnail Cache Prefix
const COLLAGE_THUMBNAIL_PREFIX = "collage_thumbnail_";
const REPOST_THUMBNAIL_PREFIX = "repost_thumbnail_";
const MAX_RECENT_PROFILES = 5;

// Context
const ProfileContext = createContext();

export const useProfile = () => useContext(ProfileContext);

export const ProfileProvider = ({ children, userId }) => {
  // === State Management ===
  const [profileData, setProfileData] = useState(null);
  const [collages, setCollages] = useState([]);
  const [reposts, setReposts] = useState([]);
  const [recentProfiles, setRecentProfiles] = useState([]); // Recently visited profiles

  // Pagination State
  const [collagesCursor, setCollagesCursor] = useState(null);
  const [repostsCursor, setRepostsCursor] = useState(null);
  const [hasNextCollagesPage, setHasNextCollagesPage] = useState(false);
  const [hasNextRepostsPage, setHasNextRepostsPage] = useState(false);

  // === Helper: Retrieve Cached Thumbnail Keys ===
  const getCachedThumbnailKeys = async (prefix) => {
    try {
      const keys = await FileSystem.readDirectoryAsync(
        FileSystem.documentDirectory
      );
      return keys.filter((key) => key.startsWith(prefix));
    } catch (error) {
      console.error("Error retrieving cached thumbnail keys:", error);
      return [];
    }
  };

  // === Manage Thumbnails for Recently Visited Profiles ===
  const manageVisitedProfilesThumbnails = async (profileId) => {
    try {
      const updatedProfiles = [...recentProfiles, profileId];

      // Limit recent profiles to MAX_RECENT_PROFILES
      if (updatedProfiles.length > MAX_RECENT_PROFILES) {
        const removedProfile = updatedProfiles.shift();
        await clearProfileThumbnails(removedProfile);
      }

      setRecentProfiles(updatedProfiles);
    } catch (error) {
      console.error("Error managing visited profiles thumbnails:", error);
    }
  };

  // === Clear Profile Thumbnails ===
  const clearProfileThumbnails = async (profileId) => {
    try {
      const collageKeys = await getCachedThumbnailKeys(
        `${COLLAGE_THUMBNAIL_PREFIX}${profileId}_`
      );
      const repostKeys = await getCachedThumbnailKeys(
        `${REPOST_THUMBNAIL_PREFIX}${profileId}_`
      );

      const keysToClear = [...collageKeys, ...repostKeys];

      for (const key of keysToClear) {
        const uri = await getImageFromFileSystem(key);
        if (uri) await FileSystem.deleteAsync(uri);
      }
    } catch (error) {
      console.error(
        `Error clearing thumbnails for profile ${profileId}:`,
        error
      );
    }
  };

  // === Manage Thumbnails for Items ===
  const manageThumbnails = async (items, prefix, profileId, getImageKey) => {
    const MAX_THUMBNAILS = 15;

    try {
      const prioritizedItems = items.slice(0, MAX_THUMBNAILS);

      for (const item of prioritizedItems) {
        const imageKey = getImageKey(item, profileId);
        const existingThumbnail = await getImageFromFileSystem(imageKey);

        if (!existingThumbnail) {
          await saveImageToFileSystem(imageKey, item.coverImage);
        }
      }
    } catch (error) {
      console.error(`Error managing thumbnails for prefix "${prefix}":`, error);
    }
  };

  // === Fetch Profile Data ===
  const fetchUserProfile = async () => {
    try {
      const { data } = await client.query({
        query: GET_USER_PROFILE,
        variables: {
          userId,
          collagesCursor: null,
          repostsCursor: null,
          limit: 15,
        },
      });

      const profile = data.getUserProfileById;

      // Update state
      setProfileData(profile);
      setCollages(profile.collages.items || []);
      setReposts(profile.repostedCollages.items || []);
      setCollagesCursor(profile.collages.nextCursor);
      setRepostsCursor(profile.repostedCollages.nextCursor);
      setHasNextCollagesPage(profile.collages.hasNextPage);
      setHasNextRepostsPage(profile.repostedCollages.hasNextPage);

      // Manage thumbnails
      await manageVisitedProfilesThumbnails(profile._id);
      await manageThumbnails(
        profile.collages.items,
        COLLAGE_THUMBNAIL_PREFIX,
        profile._id,
        (collage, profileId) =>
          `${COLLAGE_THUMBNAIL_PREFIX}${profileId}_${collage._id}`
      );
      await manageThumbnails(
        profile.repostedCollages.items,
        REPOST_THUMBNAIL_PREFIX,
        profile._id,
        (repost, profileId) =>
          `${REPOST_THUMBNAIL_PREFIX}${profileId}_${repost._id}`
      );
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  // === Fetch More Collages ===
  const fetchMoreCollages = async () => {
    if (!hasNextCollagesPage) return;

    try {
      const { data } = await client.query({
        query: GET_USER_PROFILE,
        variables: {
          userId,
          collagesCursor,
          repostsCursor: null,
          limit: 15,
        },
      });

      const newCollages = data.getUserProfileById.collages;
      setCollages((prev) => [...prev, ...newCollages.items]);
      setCollagesCursor(newCollages.nextCursor);
      setHasNextCollagesPage(newCollages.hasNextPage);
    } catch (error) {
      console.error("Error fetching more collages:", error);
    }
  };

  // === Fetch More Reposts ===
  const fetchMoreReposts = async () => {
    if (!hasNextRepostsPage) return;

    try {
      const { data } = await client.query({
        query: GET_USER_PROFILE,
        variables: {
          userId,
          collagesCursor: null,
          repostsCursor,
          limit: 15,
        },
      });

      const newReposts = data.getUserProfileById.repostedCollages;
      setReposts((prev) => [...prev, ...newReposts.items]);
      setRepostsCursor(newReposts.nextCursor);
      setHasNextRepostsPage(newReposts.hasNextPage);
    } catch (error) {
      console.error("Error fetching more reposts:", error);
    }
  };

  // === Increment/Decrement Counts ===
  const incrementFollowers = () => {
    setProfileData((prev) => ({
      ...prev,
      followersCount: (prev?.followersCount || 0) + 1,
    }));
  };

  const decrementFollowers = () => {
    setProfileData((prev) => ({
      ...prev,
      followersCount: Math.max((prev?.followersCount || 0) - 1, 0),
    }));
  };

  const incrementFollowing = () => {
    setProfileData((prev) => ({
      ...prev,
      followingCount: (prev?.followingCount || 0) + 1,
    }));
  };

  const decrementFollowing = () => {
    setProfileData((prev) => ({
      ...prev,
      followingCount: Math.max((prev?.followingCount || 0) - 1, 0),
    }));
  };

  // === User Relation Methods ===
  const followUser = async (userId) => {
    try {
      const { data } = await client.mutate({
        mutation: FOLLOW_USER,
        variables: { userIdToFollow: userId },
      });

      if (data?.followUser?.success) {
        incrementFollowers();
        setProfileData((prev) => ({ ...prev, isFollowing: true }));
      }
    } catch (error) {
      console.error(`[ProfileContext] Error following user ${userId}:`, error);
    }
  };

  const unfollowUser = async (userId) => {
    try {
      const { data } = await client.mutate({
        mutation: UNFOLLOW_USER,
        variables: { userIdToUnfollow: userId },
      });

      if (data?.unfollowUser?.success) {
        decrementFollowers();
        setProfileData((prev) => ({ ...prev, isFollowing: false }));
      }
    } catch (error) {
      console.error(
        `[ProfileContext] Error unfollowing user ${userId}:`,
        error
      );
    }
  };

  const sendFollowRequest = async (userId) => {
    try {
      const { data } = await client.mutate({
        mutation: SEND_FOLLOW_REQUEST,
        variables: { userIdToFollow: userId },
      });

      if (data?.sendFollowRequest?.success) {
        setProfileData((prev) => ({ ...prev, isFollowRequested: true }));
      }
    } catch (error) {
      console.error(
        `[ProfileContext] Error sending follow request to user ${userId}:`,
        error
      );
    }
  };

  const unsendFollowRequest = async (userId) => {
    try {
      const { data } = await client.mutate({
        mutation: UNSEND_FOLLOW_REQUEST,
        variables: { userIdToUnfollow: userId },
      });

      if (data?.unsendFollowRequest?.success) {
        setProfileData((prev) => ({ ...prev, isFollowRequested: false }));
      }
    } catch (error) {
      console.error(
        `[ProfileContext] Error canceling follow request for user ${userId}:`,
        error
      );
    }
  };

  // === Initialization ===
  useEffect(() => {
    fetchUserProfile();
  }, [userId]);

  return (
    <ProfileContext.Provider
      value={{
        profileData,
        collages,
        reposts,
        collagesCursor,
        repostsCursor,
        hasNextCollagesPage,
        hasNextRepostsPage,
        fetchMoreCollages,
        fetchMoreReposts,
        incrementFollowers,
        decrementFollowers,
        incrementFollowing,
        decrementFollowing,
        followUser,
        unfollowUser,
        sendFollowRequest,
        unsendFollowRequest,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};
