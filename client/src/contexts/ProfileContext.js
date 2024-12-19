import React, { createContext, useContext, useState } from "react";
import {
  saveMetadataToCache,
  getMetadataFromCache,
  saveImageToFileSystem,
} from "../utils/newCacheHelper";
import { useLazyQuery, useMutation } from "@apollo/client";
import { GET_USER_PROFILE } from "../utils/queries/index";
import {
  FOLLOW_USER,
  UNFOLLOW_USER,
  SEND_FOLLOW_REQUEST,
  UNSEND_FOLLOW_REQUEST,
} from "../utils/mutations/userRelationsMutations";

const ProfileContext = createContext();

const CACHE_KEY_PROFILE = (userId) => `profile_${userId}`;
const CACHE_KEY_PROFILE_IMAGE = (userId) => `profile_image_${userId}`;

export const ProfileProvider = ({ children }) => {
  const [profiles, setProfiles] = useState({});
  const [isProfileCacheInitialized, setIsProfileCacheInitialized] = useState(
    {}
  );

  const [fetchUserProfile] = useLazyQuery(GET_USER_PROFILE);
  const [followUserMutation] = useMutation(FOLLOW_USER);
  const [unfollowUserMutation] = useMutation(UNFOLLOW_USER);
  const [sendFollowRequestMutation] = useMutation(SEND_FOLLOW_REQUEST);
  const [unsendFollowRequestMutation] = useMutation(UNSEND_FOLLOW_REQUEST);

  // === Initialize Profile Cache ===
  const initializeProfileCache = async (userId, isAdmin = false) => {
    console.log("WE HERE");
    console.log("userId", userId);

    if (isProfileCacheInitialized[userId]) return;
    console.log("Past isProfileCacheInitialized");

    try {
      const cacheKey = CACHE_KEY_PROFILE(userId);
      const isPersistent = isAdmin;

      const cachedProfile = await getMetadataFromCache(cacheKey, isPersistent);

      if (cachedProfile) {
        console.log("Already Cached Profile");

        setProfiles((prev) => ({ ...prev, [userId]: cachedProfile }));
        setIsProfileCacheInitialized((prev) => ({ ...prev, [userId]: true }));
        return;
      }

      const { data } = await fetchUserProfile({
        variables: {
          userId,
          collagesCursor: null,
          repostsCursor: null,
          limit: 15,
        },
      });

      console.log(data);

      const fetchedProfile = data?.getUserProfileById;

      if (fetchedProfile) {
        await cacheProfile(userId, fetchedProfile, isAdmin);
        setProfiles((prev) => ({ ...prev, [userId]: fetchedProfile }));
      }

      setIsProfileCacheInitialized((prev) => ({ ...prev, [userId]: true }));
    } catch (error) {
      console.error(
        `[ProfileContext] Error initializing profile cache:`,
        error
      );
    }
  };

  // === Cache Profile ===
  const cacheProfile = async (userId, profile, isAdmin) => {
    try {
      const isPersistent = isAdmin;

      await saveMetadataToCache(
        CACHE_KEY_PROFILE(userId),
        profile,
        isPersistent
      );

      if (profile.image) {
        const cacheKey = CACHE_KEY_PROFILE_IMAGE(userId);
        await saveImageToFileSystem(cacheKey, profile.image, isPersistent);
      }
    } catch (error) {
      console.error(
        `[ProfileContext] Error caching profile for user ${userId}:`,
        error
      );
    }
  };

  // === Fetch More Collages ===
  const fetchMoreCollages = async (userId, currentCursor) => {
    try {
      const { data } = await fetchUserProfile({
        variables: {
          userId,
          collagesCursor: currentCursor,
          repostsCursor: null,
          limit: 15,
        },
      });

      const collages = data?.getUserProfileById?.collages;

      if (collages) {
        setProfiles((prev) => {
          const updatedProfile = {
            ...prev[userId],
            collages: {
              ...prev[userId].collages,
              items: [...prev[userId].collages.items, ...collages.items],
              nextCursor: collages.nextCursor,
              hasNextPage: collages.hasNextPage,
            },
          };
          return { ...prev, [userId]: updatedProfile };
        });

        console.log(`[ProfileContext] Fetched more collages for ${userId}.`);
      }
    } catch (error) {
      console.error(
        `[ProfileContext] Error fetching more collages for user ${userId}:`,
        error
      );
    }
  };

  // === Fetch More Reposts ===
  const fetchMoreReposts = async (userId, currentCursor) => {
    try {
      const { data } = await fetchUserProfile({
        variables: {
          userId,
          collagesCursor: null,
          repostsCursor: currentCursor,
          limit: 15,
        },
      });

      const reposts = data?.getUserProfileById?.repostedCollages;

      if (reposts) {
        setProfiles((prev) => {
          const updatedProfile = {
            ...prev[userId],
            repostedCollages: {
              ...prev[userId].repostedCollages,
              items: [...prev[userId].repostedCollages.items, ...reposts.items],
              nextCursor: reposts.nextCursor,
              hasNextPage: reposts.hasNextPage,
            },
          };
          return { ...prev, [userId]: updatedProfile };
        });

        console.log(`[ProfileContext] Fetched more reposts for ${userId}.`);
      }
    } catch (error) {
      console.error(
        `[ProfileContext] Error fetching more reposts for user ${userId}:`,
        error
      );
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

        await cacheProfile(userId, profiles[userId]);
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

        await cacheProfile(userId, profiles[userId]);
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
          [userId]: {
            ...prev[userId],
            isFollowRequested: true,
          },
        }));

        await cacheProfile(userId, profiles[userId]);
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
          [userId]: {
            ...prev[userId],
            isFollowRequested: false,
          },
        }));

        await cacheProfile(userId, profiles[userId]);
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
    followUser,
    unfollowUser,
    sendFollowRequest,
    unsendFollowRequest,
    incrementFollowers,
    decrementFollowers,
    incrementFollowing,
    decrementFollowing,
    fetchMoreCollages,
    fetchMoreReposts,
    resetProfileState,
  };

  return (
    <ProfileContext.Provider value={contextValue}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);
