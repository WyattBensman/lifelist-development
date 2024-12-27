import React, { createContext, useContext, useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { UPDATE_USER_DATA } from "../utils/mutations";
import {
  GET_USER_DATA,
  GET_COLLAGES_REPOSTS_MOMENTS,
  GET_USER_COUNTS,
} from "../utils/queries";
import {
  saveImageToFileSystem,
  getImageFromFileSystem,
  saveMetadataToCache,
  getMetadataFromCache,
} from "../utils/newCacheHelper";
import { useAuth } from "./AuthContext";
import * as FileSystem from "expo-file-system";
import { DELETE_MOMENT, POST_MOMENT } from "../utils/mutations/momentMutations";

const AdminProfileContext = createContext();

export const AdminProfileProvider = ({ children }) => {
  const { currentUser } = useAuth();

  // State for admin profile
  const [adminProfile, setAdminProfile] = useState(null);
  const [originalAdminProfile, setOriginalAdminProfile] = useState(null);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [shouldRefetch, setShouldRefetch] = useState(false);

  // State for collages, reposts, and moments
  const [collages, setCollages] = useState([]);
  const [reposts, setReposts] = useState([]);
  const [moments, setMoments] = useState([]);
  const [hasActiveMoments, setHasActiveMoments] = useState(false);
  const [collagesCursor, setCollagesCursor] = useState(null);
  const [repostsCursor, setRepostsCursor] = useState(null);
  const [hasNextCollagesPage, setHasNextCollagesPage] = useState(false);
  const [hasNextRepostsPage, setHasNextRepostsPage] = useState(false);
  const [counts, setCounts] = useState({
    followersCount: 0,
    followingCount: 0,
    collagesCount: 0,
  });

  // Cache keys
  const PROFILE_CACHE_KEY = `admin_profile_data_${currentUser}`;
  const COLLAGES_CACHE_KEY = `collages_cache_${currentUser}`;
  const REPOSTS_CACHE_KEY = `reposts_cache_${currentUser}`;
  const MOMENTS_CACHE_KEY = `moments_cache_${currentUser}`;
  const PROFILE_PICTURE_KEY = `admin_profile_picture_${currentUser}`;
  const COUNTS_CACHE_KEY = `admin_profile_counts_${currentUser}`;
  const COUNT_TTL = 3 * 60 * 1000; // 3 minutes TTL

  // === Utility: Check for Active Moments ===
  const checkActiveMoments = (moments) => {
    return moments.some((moment) => {
      const expiresAt =
        typeof moment.expiresAt === "string"
          ? new Date(Number(moment.expiresAt)) // Convert string epoch to Date
          : new Date(moment.expiresAt); // Handle Date or number
      return expiresAt > new Date();
    });
  };

  // === TTL-Based Count Fetching Logic ===
  const shouldFetchCounts = async () => {
    const lastFetched = await getMetadataFromCache(
      `${COUNTS_CACHE_KEY}_lastFetched`
    );
    const now = Date.now();
    return !lastFetched || now - lastFetched > COUNT_TTL;
  };

  const fetchAndCacheCounts = async () => {
    try {
      const { data } = await client.query({
        query: GET_USER_COUNTS,
        variables: { userId: currentUser },
      });

      if (data) {
        const { followersCount, followingCount, collagesCount } =
          data.getUserCounts;
        setCounts({ followersCount, followingCount, collagesCount });

        // Cache counts and timestamp
        await saveMetadataToCache(COUNTS_CACHE_KEY, {
          followersCount,
          followingCount,
          collagesCount,
        });
        await saveMetadataToCache(
          `${COUNTS_CACHE_KEY}_lastFetched`,
          Date.now()
        );
      }
    } catch (error) {
      console.error("Error fetching and caching user counts:", error);
    }
  };

  // === Manual Refresh Counts Method ===
  const refreshUserCounts = async () => {
    await fetchAndCacheCounts();
  };

  // === Load Cached Data ===
  useEffect(() => {
    const initializeCachedData = async () => {
      const [cachedProfile, cachedMoments, cachedCounts, cachedProfilePicture] =
        await Promise.all([
          getMetadataFromCache(PROFILE_CACHE_KEY),
          getMetadataFromCache(MOMENTS_CACHE_KEY),
          getMetadataFromCache(COUNTS_CACHE_KEY),
          getImageFromFileSystem(PROFILE_PICTURE_KEY),
        ]);

      if (cachedProfile) {
        setAdminProfile({
          ...cachedProfile,
          profilePicture: cachedProfilePicture || cachedProfile.profilePicture,
        });
        setOriginalAdminProfile(cachedProfile);
      } else {
        setShouldRefetch(true);
      }

      if (cachedMoments) {
        const validMoments = cachedMoments.filter(
          (moment) => new Date(moment.expiresAt) > new Date()
        );
        setMoments(validMoments);
        setHasActiveMoments(checkActiveMoments(validMoments));
      }
      if (cachedCounts) {
        setCounts(cachedCounts);
      }
    };

    initializeCachedData();
  }, []);

  // === Queries ===
  const { data: userData } = useQuery(GET_USER_DATA, {
    variables: { userId: currentUser },
    skip: !shouldRefetch,
    onCompleted: async (data) => {
      const user = data.getUserData;

      const profilePictureUri = await saveImageToFileSystem(
        PROFILE_PICTURE_KEY,
        user.profilePicture
      );

      const profile = {
        ...user,
        profilePicture: profilePictureUri || user.profilePicture,
      };

      setAdminProfile(profile);
      setOriginalAdminProfile(profile);
      await saveMetadataToCache(PROFILE_CACHE_KEY, user); // Cache profile data
      setShouldRefetch(false);
    },
  });

  const { data: collagesRepostsData, fetchMore } = useQuery(
    GET_COLLAGES_REPOSTS_MOMENTS,
    {
      variables: {
        userId: currentUser,
        collagesCursor: null,
        repostsCursor: null,
        limit: 15,
      },
      onCompleted: async (data) => {
        const { collages, repostedCollages, moments } =
          data.getCollagesRepostsMoments;

        // Update state
        setCollages(collages.items || []);
        setReposts(repostedCollages.items || []);
        setMoments(moments || []);
        setHasActiveMoments(checkActiveMoments(moments));

        //
        await manageCollageThumbnails();
        await manageRepostThumbnails();

        // Update cursors
        setCollagesCursor(collages.nextCursor);
        setRepostsCursor(repostedCollages.nextCursor);
        setHasNextCollagesPage(collages.hasNextPage);
        setHasNextRepostsPage(repostedCollages.hasNextPage);

        // Cache data
        await saveMetadataToCache(MOMENTS_CACHE_KEY, moments);
      },
      onError: (error) => {
        console.error("Error fetching collages, reposts, and moments:", error);
      },
    }
  );

  const { data: countsData } = useQuery(GET_USER_COUNTS, {
    variables: { userId: currentUser },
    onCompleted: async (data) => {
      const { followersCount, followingCount, collagesCount } =
        data.getUserCounts;

      setCounts({
        followersCount,
        followingCount,
        collagesCount,
      });

      await saveMetadataToCache(COUNTS_CACHE_KEY, {
        followersCount,
        followingCount,
        collagesCount,
      });
    },
  });

  // === Fetch More Methods ===
  const fetchMoreCollages = async () => {
    if (!hasNextCollagesPage) return;

    const { data } = await fetchMore({
      variables: {
        userId: currentUser,
        collagesCursor,
        repostsCursor: null,
        limit: 15,
      },
    });

    const { items, nextCursor, hasNextPage } =
      data.getCollagesAndReposts.collages;
    setCollages((prev) => [...prev, ...items]);
    setCollagesCursor(nextCursor);
    setHasNextCollagesPage(hasNextPage);
  };

  const fetchMoreReposts = async () => {
    if (!hasNextRepostsPage) return;

    const { data } = await fetchMore({
      variables: {
        userId: currentUser,
        collagesCursor: null,
        repostsCursor,
        limit: 15,
      },
    });

    const { items, nextCursor, hasNextPage } =
      data.getCollagesAndReposts.repostedCollages;
    setReposts((prev) => [...prev, ...items]);
    setRepostsCursor(nextCursor);
    setHasNextRepostsPage(hasNextPage);
  };

  // === Refresh ===
  const refreshAdminProfile = async () => {
    setShouldRefetch(true);
  };

  // === Mutations ===
  const [updateAdminDataMutation] = useMutation(UPDATE_USER_DATA);

  // === Methods ===
  const updateAdminProfileField = (key, value) => {
    setAdminProfile((prev) => ({ ...prev, [key]: value }));
    setUnsavedChanges(true);
  };

  const saveAdminProfile = async () => {
    try {
      const result = await updateAdminDataMutation({
        variables: { ...adminProfile },
      });
      const updatedUserData = result.data.updateUserData.user;

      const profilePictureUri = await saveImageToFileSystem(
        PROFILE_PICTURE_KEY,
        updatedUserData.profilePicture
      );

      const profileWithImage = {
        ...updatedUserData,
        profilePicture: profilePictureUri || updatedUserData.profilePicture,
      };

      setAdminProfile(profileWithImage);
      setOriginalAdminProfile(profileWithImage);

      await saveMetadataToCache(PROFILE_CACHE_KEY, updatedUserData);
      setUnsavedChanges(false);
    } catch (error) {
      console.error("Failed to save admin profile:", error);
    }
  };

  // === Thumbnail Caching Helpers ===
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

  const manageCollageThumbnails = async () => {
    const MAX_THUMBNAILS = 15;

    try {
      // Extract the first 15 collages
      const prioritizedCollages = collages.slice(0, MAX_THUMBNAILS);

      // Save thumbnails for the first 15 collages
      for (const collage of prioritizedCollages) {
        const imageKey = `collage_thumbnail_${collage._id}`;
        const existingThumbnail = await getImageFromFileSystem(imageKey);

        if (!existingThumbnail) {
          await saveImageToFileSystem(imageKey, collage.coverImage);
        }
      }

      // Remove thumbnails not in the first 15
      const cachedKeys = await getCachedThumbnailKeys("collage_thumbnail_");
      const prioritizedKeys = prioritizedCollages.map(
        (collage) => `collage_thumbnail_${collage._id}`
      );

      const keysToRemove = cachedKeys.filter(
        (key) => !prioritizedKeys.includes(key)
      );

      for (const key of keysToRemove) {
        const uri = await getImageFromFileSystem(key);
        if (uri) {
          await FileSystem.deleteAsync(uri);
        }
      }
    } catch (error) {
      console.error("Error managing collage thumbnails:", error);
    }
  };

  const manageRepostThumbnails = async () => {
    const MAX_THUMBNAILS = 15;

    try {
      const prioritizedReposts = reposts.slice(0, MAX_THUMBNAILS);

      for (const repost of prioritizedReposts) {
        const imageKey = `repost_thumbnail_${repost._id}`;
        const existingThumbnail = await getImageFromFileSystem(imageKey);

        if (!existingThumbnail) {
          await saveImageToFileSystem(imageKey, repost.coverImage);
        }
      }

      const cachedKeys = await getCachedThumbnailKeys("repost_thumbnail_");
      const prioritizedKeys = prioritizedReposts.map(
        (repost) => `repost_thumbnail_${repost._id}`
      );

      const keysToRemove = cachedKeys.filter(
        (key) => !prioritizedKeys.includes(key)
      );

      for (const key of keysToRemove) {
        const uri = await getImageFromFileSystem(key);
        if (uri) {
          await FileSystem.deleteAsync(uri);
        }
      }
    } catch (error) {
      console.error("Error managing repost thumbnails:", error);
    }
  };

  // === Mutations ===
  const [postMomentMutation] = useMutation(POST_MOMENT);
  const [deleteMomentMutation] = useMutation(DELETE_MOMENT);

  // === Collage State Management ===
  const addCollage = async (collage) => {
    try {
      // Update collages state
      setCollages((prev) => [...prev, collage]);

      // Increment collages count
      setCounts((prevCounts) => ({
        ...prevCounts,
        collagesCount: prevCounts.collagesCount + 1,
      }));

      // Save updated collages to cache
      await saveMetadataToCache(COLLAGES_CACHE_KEY, [...collages, collage]);
      await manageCollageThumbnails();

      // Save updated counts to cache
      await saveMetadataToCache(COUNTS_CACHE_KEY, {
        ...counts,
        collagesCount: counts.collagesCount + 1,
      });
    } catch (error) {
      console.error("Error adding collage:", error);
    }
  };

  const removeCollage = async (collageId) => {
    try {
      // Filter out the collage
      const updatedCollages = collages.filter((c) => c._id !== collageId);
      setCollages(updatedCollages);

      // Decrement collages count safely (ensure it doesn't go below zero)
      setCounts((prevCounts) => ({
        ...prevCounts,
        collagesCount: Math.max(prevCounts.collagesCount - 1, 0),
      }));

      // Save updated collages to cache
      await saveMetadataToCache(COLLAGES_CACHE_KEY, updatedCollages);
      await manageCollageThumbnails();

      // Save updated counts to cache
      await saveMetadataToCache(COUNTS_CACHE_KEY, {
        ...counts,
        collagesCount: Math.max(counts.collagesCount - 1, 0),
      });
    } catch (error) {
      console.error("Error removing collage:", error);
    }
  };

  // === Repost State Management ===
  const addRepost = async (repost) => {
    setReposts((prev) => [...prev, repost]);
    await saveMetadataToCache(REPOSTS_CACHE_KEY, [...reposts, repost]);
    await manageRepostThumbnails();
  };

  const removeRepost = async (repostId) => {
    const updatedReposts = reposts.filter((r) => r._id !== repostId);
    setReposts(updatedReposts);
    await saveMetadataToCache(REPOSTS_CACHE_KEY, updatedReposts);
    await manageRepostThumbnails();
  };

  // === Moment State Management ===
  const addMoment = async (momentInput) => {
    try {
      const { data } = await postMomentMutation({
        variables: { cameraShotId: momentInput.cameraShotId },
      });

      if (data?.postMoment?.success) {
        const moment = {
          _id: data.postMoment._id,
          createdAt: data.postMoment.createdAt,
          expiresAt: data.postMoment.expiresAt,
        };

        setMoments((prev) => [...prev, moment]);
        setHasActiveMoments(true);
        await saveMetadataToCache(MOMENTS_CACHE_KEY, [...moments, moment]);
        console.log("Made it through caching");
      }
    } catch (error) {
      console.error("Error posting moment:", error);
      throw new Error("Failed to post moment.");
    }
  };

  const removeMoment = async (momentId) => {
    try {
      // Perform the mutation
      const { data } = await deleteMomentMutation({
        variables: { momentId },
      });

      if (data?.deleteMoment?.success) {
        // Filter the moment out of the state
        const updatedMoments = moments.filter((m) => m._id !== momentId);
        setMoments(updatedMoments);
        setHasActiveMoments(checkActiveMoments(updatedMoments));

        // Update the cache
        await saveMetadataToCache(MOMENTS_CACHE_KEY, updatedMoments);

        console.log("Moment successfully deleted:", momentId);
      } else {
        console.error("Failed to delete moment:", data?.deleteMoment?.message);
      }
    } catch (error) {
      console.error("Error deleting moment:", error);
      throw new Error("Failed to delete moment.");
    }
  };

  const resetAdminChanges = () => {
    setAdminProfile(originalAdminProfile);
    setUnsavedChanges(false);
  };

  // === Increment/Decrement User Relations Counters ===
  const incrementFollowers = () => {
    setCounts((prev) => ({
      ...prev,
      followersCount: prev.followersCount + 1,
    }));
  };

  const decrementFollowers = () => {
    setCounts((prev) => ({
      ...prev,
      followersCount: Math.max(prev.followersCount - 1, 0),
    }));
  };

  const incrementFollowing = () => {
    setCounts((prev) => ({
      ...prev,
      followingCount: prev.followingCount + 1,
    }));
  };

  const decrementFollowing = () => {
    setCounts((prev) => ({
      ...prev,
      followingCount: Math.max(prev.followingCount - 1, 0),
    }));
  };

  // Reset state method
  const resetAdminProfileState = () => {
    setAdminProfile(null);
    setCollages([]);
    setReposts([]);
    setMoments([]);
    setHasActiveMoments(false);
  };

  return (
    <AdminProfileContext.Provider
      value={{
        adminProfile,
        collages,
        reposts,
        counts,
        moments,
        hasActiveMoments,
        unsavedChanges,
        updateAdminProfileField,
        saveAdminProfile,
        resetAdminChanges,
        refreshAdminProfile,
        resetAdminProfileState,
        fetchMoreCollages,
        fetchMoreReposts,
        incrementFollowers,
        decrementFollowers,
        incrementFollowing,
        decrementFollowing,
        addCollage,
        removeCollage,
        addRepost,
        removeRepost,
        addMoment,
        removeMoment,
      }}
    >
      {children}
    </AdminProfileContext.Provider>
  );
};

export const useAdminProfile = () => useContext(AdminProfileContext);
