import React, { createContext, useContext, useState } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import { GET_USER_PROFILE } from "../utils/queries/index";
import {
  FOLLOW_USER,
  UNFOLLOW_USER,
  SEND_FOLLOW_REQUEST,
  UNSEND_FOLLOW_REQUEST,
} from "../utils/mutations/userRelationsMutations";
import {
  getMetaDataFromCache,
  saveMetaDataToCache,
} from "../utils/newCacheHelper";

const ProfileCacheContext = createContext();

export const ProfileCacheProvider = ({ children }) => {
  const [profiles, setProfiles] = useState({}); // Cached profiles keyed by user ID
  const [isProfileInitialized, setIsProfileInitialized] = useState({}); // Per-user initialization state

  const CACHE_KEY = "cached_profiles";

  const [fetchProfileQuery] = useLazyQuery(GET_USER_PROFILE);

  const initializeProfileCache = async (userId, limit = 12) => {
    if (isProfileInitialized[userId]) {
      console.log(
        `[ProfileCache] Profile for user ${userId} is already initialized.`
      );
      return;
    }

    try {
      const cacheKey = `profile_${userId}`;
      const cachedProfile = await getMetaDataFromCache(cacheKey);

      if (cachedProfile) {
        console.log(
          `[ProfileCache] Loaded profile for user ${userId} from cache.`
        );
        setProfiles((prev) => ({ ...prev, [userId]: cachedProfile }));
        setIsProfileInitialized((prev) => ({ ...prev, [userId]: true }));
        return;
      }

      const profile = await fetchProfileFromServer(userId, limit);
      if (profile) {
        console.log(
          `[ProfileCache] Successfully fetched profile for user ${userId}.`
        );
        setProfiles((prev) => ({ ...prev, [userId]: profile }));
        setIsProfileInitialized((prev) => ({ ...prev, [userId]: true }));
        await saveMetaDataToCache(cacheKey, profile);
      }
    } catch (error) {
      console.error(
        `[ProfileCache] Error initializing profile for user ${userId}:`,
        error
      );
      setIsProfileInitialized((prev) => ({ ...prev, [userId]: false })); // Prevent infinite retries
    }
  };

  const fetchProfileFromServer = async (userId, limit) => {
    try {
      const { data } = await fetchProfileQuery({
        variables: { userId, limit },
        fetchPolicy: "network-only", // Always fetch fresh data
      });
      return data?.getUserProfileById;
    } catch (error) {
      console.error(
        `[ProfileCache] Error fetching profile from server:`,
        error
      );
      return null;
    }
  };

  const saveToCache = async (updatedProfiles) => {
    setProfiles(updatedProfiles);
    await saveMetaDataToCache(CACHE_KEY, updatedProfiles);
  };

  const refetchProfile = async (userId) => {
    console.log(`[ProfileCache] Refetching profile for user ${userId}.`);
    const { data } = await fetchProfileQuery({
      variables: { userId },
      fetchPolicy: "network-only",
    });

    const profile = data?.getUserProfileById;
    if (profile) {
      const updatedProfiles = { ...profiles, [userId]: profile };
      await saveToCache(updatedProfiles);
    }
    return profile;
  };

  const [followUserMutation] = useMutation(FOLLOW_USER);
  const [unfollowUserMutation] = useMutation(UNFOLLOW_USER);
  const [sendFollowRequestMutation] = useMutation(SEND_FOLLOW_REQUEST);
  const [unsendFollowRequestMutation] = useMutation(UNSEND_FOLLOW_REQUEST);

  const followUser = async (userId) => {
    const { data } = await followUserMutation({
      variables: { userIdToFollow: userId },
    });
    if (data.followUser.success) {
      const updatedProfiles = {
        ...profiles,
        [userId]: {
          ...profiles[userId],
          followersCount: (profiles[userId]?.followersCount || 0) + 1,
        },
      };
      await saveToCache(updatedProfiles);
    }
  };

  const unfollowUser = async (userId) => {
    const { data } = await unfollowUserMutation({
      variables: { userIdToUnfollow: userId },
    });
    if (data.unfollowUser.success) {
      const updatedProfiles = {
        ...profiles,
        [userId]: {
          ...profiles[userId],
          followersCount: Math.max(
            (profiles[userId]?.followersCount || 1) - 1,
            0
          ),
        },
      };
      await saveToCache(updatedProfiles);
    }
  };

  const sendFollowRequest = async (userId) => {
    const { data } = await sendFollowRequestMutation({
      variables: { userIdToFollow: userId },
    });
    if (data.sendFollowRequest.success) {
      console.log(`[ProfileCache] Follow request sent to user ${userId}.`);
    }
  };

  const unsendFollowRequest = async (userId) => {
    const { data } = await unsendFollowRequestMutation({
      variables: { userIdToUnfollow: userId },
    });
    if (data.unsendFollowRequest.success) {
      console.log(`[ProfileCache] Follow request canceled for user ${userId}.`);
    }
  };

  return (
    <ProfileCacheContext.Provider
      value={{
        profiles,
        initializeProfileCache,
        refetchProfile,
        followUser,
        unfollowUser,
        sendFollowRequest,
        unsendFollowRequest,
        isProfileInitialized,
      }}
    >
      {children}
    </ProfileCacheContext.Provider>
  );
};

export const useProfileCache = () => useContext(ProfileCacheContext);
