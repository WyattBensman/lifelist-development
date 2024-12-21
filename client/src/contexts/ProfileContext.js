import React, { createContext, useContext, useState } from "react";
import {
  saveMetadataToCache,
  getMetadataFromCache,
} from "../utils/newCacheHelper";
import { useLazyQuery, useMutation } from "@apollo/client";
import {
  GET_USER_PROFILE,
  GET_COLLAGES_REPOSTS_MOMENTS,
} from "../utils/queries/index";
import {
  FOLLOW_USER,
  UNFOLLOW_USER,
  SEND_FOLLOW_REQUEST,
  UNSEND_FOLLOW_REQUEST,
} from "../utils/mutations/userRelationsMutations";

const ProfileContext = createContext();

const CACHE_KEY_STATIC = (userId) => `profile_static_${userId}`;
const CACHE_KEY_COLLAGES = (userId) => `profile_collages_${userId}`;
const CACHE_KEY_REPOSTS = (userId) => `profile_reposts_${userId}`;
const CACHE_KEY_MOMENTS = (userId) => `profile_moments_${userId}`;

const COLLAGES_TTL = 10 * 60 * 1000; // 10 minutes
const REPOSTS_TTL = 10 * 60 * 1000; // 10 minutes
const MOMENTS_TTL = 5 * 60 * 1000; // 5 minutes

// === Helper: Check TTL Expiration ===
const isExpired = (timestamp, ttl) => {
  return Date.now() - timestamp > ttl;
};

export const ProfileProvider = ({ children }) => {
  const [profiles, setProfiles] = useState({});
  const [isProfileCacheInitialized, setIsProfileCacheInitialized] = useState(
    {}
  );

  // === Queries ===
  const [fetchUserProfile] = useLazyQuery(GET_USER_PROFILE);
  const [fetchDynamicData] = useLazyQuery(GET_COLLAGES_REPOSTS_MOMENTS);

  // === Mutations ===
  const [followUserMutation] = useMutation(FOLLOW_USER);
  const [unfollowUserMutation] = useMutation(UNFOLLOW_USER);
  const [sendFollowRequestMutation] = useMutation(SEND_FOLLOW_REQUEST);
  const [unsendFollowRequestMutation] = useMutation(UNSEND_FOLLOW_REQUEST);

  // === Initialize Profile Cache ===
  const initializeProfileCache = async (userId) => {
    if (isProfileCacheInitialized[userId]) return;

    try {
      const staticKey = CACHE_KEY_STATIC(userId);
      const cachedStatic = await getMetadataFromCache(staticKey);

      if (cachedStatic) {
        setProfiles((prev) => ({
          ...prev,
          [userId]: { ...cachedStatic },
        }));
      } else {
        const { data } = await fetchUserProfile({
          variables: { userId, collagesCursor: null, repostsCursor: null },
        });
        const { collages, repostedCollages, moments, ...staticData } =
          data.getUserProfileById;

        await saveMetadataToCache(staticKey, staticData, true);
        setProfiles((prev) => ({
          ...prev,
          [userId]: { ...staticData, collages, repostedCollages, moments },
        }));
      }

      await refreshDynamicData(userId);
      setIsProfileCacheInitialized((prev) => ({ ...prev, [userId]: true }));
    } catch (error) {
      console.error(
        `[ProfileContext] Error initializing profile cache:`,
        error
      );
    }
  };

  // === Refresh Dynamic Data ===
  const refreshDynamicData = async (userId) => {
    try {
      const collagesKey = CACHE_KEY_COLLAGES(userId);
      const repostsKey = CACHE_KEY_REPOSTS(userId);
      const momentsKey = CACHE_KEY_MOMENTS(userId);

      const collages = await getMetadataFromCache(collagesKey);
      const reposts = await getMetadataFromCache(repostsKey);
      const moments = await getMetadataFromCache(momentsKey);

      const isCollagesExpired =
        !collages || isExpired(collages.timestamp, COLLAGES_TTL);
      const isRepostsExpired =
        !reposts || isExpired(reposts.timestamp, REPOSTS_TTL);
      const isMomentsExpired =
        !moments || isExpired(moments.timestamp, MOMENTS_TTL);

      if (isCollagesExpired || isRepostsExpired || isMomentsExpired) {
        const { data } = await fetchDynamicData({
          variables: { userId, collagesCursor: null, repostsCursor: null },
        });

        const { collages, repostedCollages, moments } =
          data.getCollagesRepostsMoments;

        if (isCollagesExpired) {
          await saveMetadataToCache(collagesKey, collages, true, COLLAGES_TTL);
        }
        if (isRepostsExpired) {
          await saveMetadataToCache(
            repostsKey,
            repostedCollages,
            true,
            REPOSTS_TTL
          );
        }
        if (isMomentsExpired) {
          await saveMetadataToCache(momentsKey, moments, true, MOMENTS_TTL);
        }

        setProfiles((prev) => ({
          ...prev,
          [userId]: {
            ...prev[userId],
            collages,
            repostedCollages,
            moments,
          },
        }));
      }
    } catch (error) {
      console.error(`[ProfileContext] Error refreshing dynamic data:`, error);
    }
  };

  // === Refetch All Data ===
  const refreshProfile = async (userId) => {
    try {
      const { data } = await fetchUserProfile({
        variables: { userId, collagesCursor: null, repostsCursor: null },
      });

      if (data?.getUserProfileById) {
        const { collages, repostedCollages, moments, ...staticData } =
          data.getUserProfileById;

        // Save static and dynamic data to cache
        await saveMetadataToCache(CACHE_KEY_STATIC(userId), staticData, true);
        await saveMetadataToCache(
          CACHE_KEY_COLLAGES(userId),
          collages,
          true,
          COLLAGES_TTL
        );
        await saveMetadataToCache(
          CACHE_KEY_REPOSTS(userId),
          repostedCollages,
          true,
          REPOSTS_TTL
        );
        await saveMetadataToCache(
          CACHE_KEY_MOMENTS(userId),
          moments,
          true,
          MOMENTS_TTL
        );

        // Update profiles state with refreshed data
        setProfiles((prev) => ({
          ...prev,
          [userId]: {
            ...staticData,
            collages,
            repostedCollages,
            moments,
          },
        }));

        setIsProfileCacheInitialized((prev) => ({ ...prev, [userId]: true }));

        console.log(`[ProfileContext] Profile refreshed for user ${userId}.`);
      }
    } catch (error) {
      console.error(`[ProfileContext] Error refreshing profile:`, error);
    }
  };

  // === Fetch More Collages ===
  const fetchMoreCollages = async (userId, currentCursor) => {
    try {
      const { data } = await fetchDynamicData({
        variables: {
          userId,
          collagesCursor: currentCursor,
          repostsCursor: null,
        },
      });

      const collages = data.getCollagesRepostsMoments.collages;
      setProfiles((prev) => ({
        ...prev,
        [userId]: {
          ...prev[userId],
          collages: {
            ...prev[userId].collages,
            items: [...prev[userId].collages.items, ...collages.items],
            nextCursor: collages.nextCursor,
            hasNextPage: collages.hasNextPage,
          },
        },
      }));
    } catch (error) {
      console.error(`[ProfileContext] Error fetching more collages:`, error);
    }
  };

  // === Fetch More Reposts ===
  const fetchMoreReposts = async (userId, currentCursor) => {
    try {
      const { data } = await fetchDynamicData({
        variables: {
          userId,
          collagesCursor: null,
          repostsCursor: currentCursor,
        },
      });

      const reposts = data.getCollagesRepostsMoments.repostedCollages;
      setProfiles((prev) => ({
        ...prev,
        [userId]: {
          ...prev[userId],
          repostedCollages: {
            ...prev[userId].repostedCollages,
            items: [...prev[userId].repostedCollages.items, ...reposts.items],
            nextCursor: reposts.nextCursor,
            hasNextPage: reposts.hasNextPage,
          },
        },
      }));
    } catch (error) {
      console.error(`[ProfileContext] Error fetching more reposts:`, error);
    }
  };

  // === Increment/Decrement Counts ===
  const incrementFollowers = (userId) => {
    setProfiles((prev) => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        followersCount: (prev[userId]?.followersCount || 0) + 1,
      },
    }));
  };

  const decrementFollowers = (userId) => {
    setProfiles((prev) => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        followersCount: Math.max((prev[userId]?.followersCount || 0) - 1, 0),
      },
    }));
  };

  const incrementFollowing = (userId) => {
    setProfiles((prev) => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        followingCount: (prev[userId]?.followingCount || 0) + 1,
      },
    }));
  };

  const decrementFollowing = (userId) => {
    setProfiles((prev) => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        followingCount: Math.max((prev[userId]?.followingCount || 0) - 1, 0),
      },
    }));
  };

  // === Follow User ===
  const followUser = async (userId) => {
    try {
      const { data } = await followUserMutation({
        variables: { userIdToFollow: userId },
      });

      if (data?.followUser?.success) {
        incrementFollowers(userId);

        setProfiles((prev) => ({
          ...prev,
          [userId]: { ...prev[userId], isFollowing: true },
        }));

        const staticKey = CACHE_KEY_STATIC(userId);
        const cachedStatic = await getMetadataFromCache(staticKey);
        if (cachedStatic) {
          await saveMetadataToCache(
            staticKey,
            { ...cachedStatic, isFollowing: true },
            true
          );
        }

        console.log(`[ProfileContext] Followed user ${userId}.`);
      }
    } catch (error) {
      console.error(`[ProfileContext] Error following user ${userId}:`, error);
    }
  };

  // === Unfollow User ===
  const unfollowUser = async (userId) => {
    try {
      const { data } = await unfollowUserMutation({
        variables: { userIdToUnfollow: userId },
      });

      if (data?.unfollowUser?.success) {
        decrementFollowers(userId);

        setProfiles((prev) => ({
          ...prev,
          [userId]: { ...prev[userId], isFollowing: false },
        }));

        const staticKey = CACHE_KEY_STATIC(userId);
        const cachedStatic = await getMetadataFromCache(staticKey);
        if (cachedStatic) {
          await saveMetadataToCache(
            staticKey,
            { ...cachedStatic, isFollowing: false },
            true
          );
        }

        console.log(`[ProfileContext] Unfollowed user ${userId}.`);
      }
    } catch (error) {
      console.error(
        `[ProfileContext] Error unfollowing user ${userId}:`,
        error
      );
    }
  };

  // === Send Follow Request ===
  const sendFollowRequest = async (userId) => {
    try {
      const { data } = await sendFollowRequestMutation({
        variables: { userIdToFollow: userId },
      });

      if (data?.sendFollowRequest?.success) {
        console.log(`[ProfileContext] Follow request sent to user ${userId}.`);

        setProfiles((prev) => ({
          ...prev,
          [userId]: { ...prev[userId], isFollowRequested: true },
        }));

        const staticKey = CACHE_KEY_STATIC(userId);
        const cachedStatic = await getMetadataFromCache(staticKey);
        if (cachedStatic) {
          await saveMetadataToCache(
            staticKey,
            { ...cachedStatic, isFollowRequested: true },
            true
          );
        }
      }
    } catch (error) {
      console.error(
        `[ProfileContext] Error sending follow request to user ${userId}:`,
        error
      );
    }
  };

  // === Unsend Follow Request ===
  const unsendFollowRequest = async (userId) => {
    try {
      const { data } = await unsendFollowRequestMutation({
        variables: { userIdToUnfollow: userId },
      });

      if (data?.unsendFollowRequest?.success) {
        console.log(
          `[ProfileContext] Follow request canceled for user ${userId}.`
        );

        setProfiles((prev) => ({
          ...prev,
          [userId]: { ...prev[userId], isFollowRequested: false },
        }));

        const staticKey = CACHE_KEY_STATIC(userId);
        const cachedStatic = await getMetadataFromCache(staticKey);
        if (cachedStatic) {
          await saveMetadataToCache(
            staticKey,
            { ...cachedStatic, isFollowRequested: false },
            true
          );
        }
      }
    } catch (error) {
      console.error(
        `[ProfileContext] Error canceling follow request for user ${userId}:`,
        error
      );
    }
  };

  // Reset state method
  const resetProfileState = () => {
    setProfiles({});
    setIsProfileCacheInitialized({});
  };

  const contextValue = {
    profiles,
    isProfileCacheInitialized,
    initializeProfileCache,
    refreshDynamicData,
    fetchMoreCollages,
    fetchMoreReposts,
    refreshProfile,
    followUser,
    unfollowUser,
    sendFollowRequest,
    unsendFollowRequest,
    incrementFollowers,
    decrementFollowers,
    incrementFollowing,
    decrementFollowing,
    resetProfileState,
  };

  return (
    <ProfileContext.Provider value={contextValue}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);

/*   // === Refresh Profile Picture ===
  const saveProfileImage = async (userId, imageUrl) => {
    try {
      await saveImageToFileSystem(
        CACHE_KEY_PROFILE_IMAGE(userId),
        imageUrl,
        true
      );
    } catch (error) {
      console.error(
        `[ProfileContext] Error saving profile image for user ${userId}:`,
        error
      );
    }
  };

  const loadProfileImage = async (userId, fallbackUrl) => {
    try {
      const cachedImage = await getImageFromFileSystem(
        CACHE_KEY_PROFILE_IMAGE(userId)
      );
      if (!cachedImage && fallbackUrl) {
        await saveProfileImage(userId, fallbackUrl);
      }
    } catch (error) {
      console.error(
        `[ProfileContext] Error loading profile image for user ${userId}:`,
        error
      );
    }
  };

  const deleteProfileImage = async (userId) => {
    try {
      await deleteImageFromFileSystem(CACHE_KEY_PROFILE_IMAGE(userId));
    } catch (error) {
      console.error(
        `[ProfileContext] Error deleting profile image for user ${userId}:`,
        error
      );
    }
  }; */
