import React, { createContext, useContext, useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_USER_PROFILE } from "../utils/queries";
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
  const [isProfileInitialized, setIsProfileInitialized] = useState(false);

  const CACHE_KEY = "cached_profiles";

  // Initialize profiles from cache on mount
  useEffect(() => {
    const initializeProfiles = async () => {
      const cachedProfiles = await getMetaDataFromCache(CACHE_KEY);
      if (cachedProfiles) {
        setProfiles(cachedProfiles);
      }
      setIsProfileInitialized(true);
    };

    initializeProfiles();
  }, []);

  const saveToCache = async (updatedProfiles) => {
    setProfiles(updatedProfiles);
    await saveMetaDataToCache(CACHE_KEY, updatedProfiles);
  };

  const fetchProfile = async (userId) => {
    if (profiles[userId]) {
      return profiles[userId]; // Return cached profile if exists
    }

    const { data } = await useQuery(GET_USER_PROFILE, {
      variables: { userId },
    });

    const profile = data?.getUserProfileById;
    if (profile) {
      const updatedProfiles = { ...profiles, [userId]: profile };
      await saveToCache(updatedProfiles);
    }
    return profile;
  };

  const refetchProfile = async (userId) => {
    const { data } = await useQuery(GET_USER_PROFILE, {
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
      console.log(`Follow request sent to user: ${userId}`);
    }
  };

  const unsendFollowRequest = async (userId) => {
    const { data } = await unsendFollowRequestMutation({
      variables: { userIdToUnfollow: userId },
    });
    if (data.unsendFollowRequest.success) {
      console.log(`Follow request canceled for user: ${userId}`);
    }
  };

  return (
    <ProfileCacheContext.Provider
      value={{
        profiles,
        isProfileInitialized,
        fetchProfile,
        refetchProfile,
        followUser,
        unfollowUser,
        sendFollowRequest,
        unsendFollowRequest,
      }}
    >
      {children}
    </ProfileCacheContext.Provider>
  );
};

export const useProfileCache = () => useContext(ProfileCacheContext);
