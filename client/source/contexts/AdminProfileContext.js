import React, { createContext, useContext, useState, useEffect } from "react";
import {
  saveMetadataToCache,
  getMetadataFromCache,
  saveImageToFileSystem,
  getImageFromFileSystem,
} from "./cacheHelper";
import {
  GET_USER_DATA,
  GET_USER_COUNTS,
  GET_COLLAGES_REPOSTS_MOMENTS,
} from "./queries";
import {
  UPDATE_USER_DATA,
  DELETE_MOMENT,
  POST_MOMENT,
} from "../utils/mutations";
import { client } from "./apolloClient"; // Import your Apollo client
import * as FileSystem from "expo-file-system";

// Cache Keys
const PROFILE_CACHE_KEY = "profile_cache";
const PROFILE_PICTURE_KEY = "profile_picture_cache";
const COUNTS_CACHE_KEY = "counts_cache";
const COLLAGES_CACHE_KEY = "collages_cache";
const REPOSTS_CACHE_KEY = "reposts_cache";
const MOMENTS_CACHE_KEY = "moments_cache";

// TTLs
const TTL_USER_DATA = 24 * 60 * 60 * 1000; // 24 hours
const TTL_COLLAGES_REPOSTS_MOMENTS = 6 * 60 * 60 * 1000; // 6 hours
const TTL_USER_COUNTS = 5 * 60 * 1000; // 5 minutes

// Context
const AdminProfileContext = createContext();

export const useAdminProfile = () => useContext(AdminProfileContext);

export const AdminProfileProvider = ({ children, userId }) => {
  // State for admin profile
  const [adminProfile, setAdminProfile] = useState(null);
  const [originalAdminProfile, setOriginalAdminProfile] = useState(null);
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  // State for counts
  const [counts, setCounts] = useState({
    followersCount: 0,
    followingCount: 0,
    collagesCount: 0,
  });

  // State for collages, reposts, and moments
  const [collages, setCollages] = useState([]);
  const [reposts, setReposts] = useState([]);
  const [moments, setMoments] = useState([]);
  const [hasActiveMoments, setHasActiveMoments] = useState(false);

  // State for pagination
  const [collagesCursor, setCollagesCursor] = useState(null);
  const [repostsCursor, setRepostsCursor] = useState(null);
  const [hasNextCollagesPage, setHasNextCollagesPage] = useState(false);
  const [hasNextRepostsPage, setHasNextRepostsPage] = useState(false);

  // === Mutations ===
  const [updateAdminDataMutation] = useMutation(UPDATE_USER_DATA);
  const [postMomentMutation] = useMutation(POST_MOMENT);
  const [deleteMomentMutation] = useMutation(DELETE_MOMENT);

  // === Methods for Admin Profile ===

  const updateAdminProfileField = (key, value) => {
    setAdminProfile((prev) => ({ ...prev, [key]: value }));
    setUnsavedChanges(true);
  };

  const saveAdminProfile = async () => {
    try {
      const result = await updateAdminDataMutation({
        variables: { ...adminProfile },
      });
      const updatedProfile = result.data.updateUserData.user;

      const profilePictureUri = await saveImageToFileSystem(
        PROFILE_PICTURE_KEY,
        updatedProfile.profilePicture
      );

      const profileWithImage = {
        ...updatedProfile,
        profilePicture: profilePictureUri || updatedProfile.profilePicture,
      };

      setAdminProfile(profileWithImage);
      setOriginalAdminProfile(profileWithImage);

      await saveMetadataToCache(PROFILE_CACHE_KEY, profileWithImage);
      setUnsavedChanges(false);
    } catch (error) {
      console.error("Failed to save admin profile:", error);
    }
  };

  const resetAdminChanges = () => {
    setAdminProfile(originalAdminProfile);
    setUnsavedChanges(false);
  };

  // === Fetch Functions ===

  const fetchAdminProfile = async () => {
    const { data } = await client.query({ query: GET_USER_DATA });
    return data.getUserData;
  };

  const fetchUserCounts = async () => {
    const { data } = await client.query({
      query: GET_USER_COUNTS,
      variables: { userId },
    });
    return data.getUserCounts;
  };

  const fetchCollagesRepostsMoments = async (cursorOverrides = {}) => {
    const {
      collagesCursor: collagesCursorOverride,
      repostsCursor: repostsCursorOverride,
    } = cursorOverrides;

    const { data } = await client.query({
      query: GET_COLLAGES_REPOSTS_MOMENTS,
      variables: {
        userId,
        collagesCursor: collagesCursorOverride || collagesCursor,
        repostsCursor: repostsCursorOverride || repostsCursor,
        limit: 15,
      },
    });
    return data.getCollagesRepostsMoments;
  };

  // === Fetch More Methods ===

  const fetchMoreCollages = async () => {
    if (!hasNextCollagesPage) return;

    const { collages: newCollages } = await fetchCollagesRepostsMoments();
    setCollages((prevCollages) => [...prevCollages, ...newCollages.items]);
    setCollagesCursor(newCollages.nextCursor);
    setHasNextCollagesPage(newCollages.hasNextPage);

    // Cache updated collages
    const cachedCollages = await getMetadataFromCache(COLLAGES_CACHE_KEY);
    const updatedCollages = {
      items: [...(cachedCollages?.items || []), ...newCollages.items],
      nextCursor: newCollages.nextCursor,
      hasNextPage: newCollages.hasNextPage,
    };
    await saveMetadataToCache(
      COLLAGES_CACHE_KEY,
      updatedCollages,
      true,
      TTL_COLLAGES_REPOSTS_MOMENTS
    );
  };

  const fetchMoreReposts = async () => {
    if (!hasNextRepostsPage) return;

    const { repostedCollages: newReposts } =
      await fetchCollagesRepostsMoments();
    setReposts((prevReposts) => [...prevReposts, ...newReposts.items]);
    setRepostsCursor(newReposts.nextCursor);
    setHasNextRepostsPage(newReposts.hasNextPage);

    // Cache updated reposts
    const cachedReposts = await getMetadataFromCache(REPOSTS_CACHE_KEY);
    const updatedReposts = {
      items: [...(cachedReposts?.items || []), ...newReposts.items],
      nextCursor: newReposts.nextCursor,
      hasNextPage: newReposts.hasNextPage,
    };
    await saveMetadataToCache(
      REPOSTS_CACHE_KEY,
      updatedReposts,
      true,
      TTL_COLLAGES_REPOSTS_MOMENTS
    );
  };

  // === Collage State Management ===

  const addCollage = async (collage) => {
    try {
      // Add the new collage to the state
      const updatedCollages = [...collages, collage];
      setCollages(updatedCollages);

      // Increment the collages count in the state
      setCounts((prevCounts) => ({
        ...prevCounts,
        collagesCount: prevCounts.collagesCount + 1,
      }));

      // Save collages and counts to cache
      await saveMetadataToCache(COLLAGES_CACHE_KEY, updatedCollages);
      await saveMetadataToCache(COUNTS_CACHE_KEY, {
        ...counts,
        collagesCount: counts.collagesCount + 1,
      });

      // Manage thumbnails after adding a collage
      await manageCollageThumbnails();
    } catch (error) {
      console.error("Error adding collage:", error);
    }
  };

  const removeCollage = async (collageId) => {
    try {
      // Remove the collage from the state
      const updatedCollages = collages.filter((c) => c._id !== collageId);
      setCollages(updatedCollages);

      // Decrement the collages count in the state
      setCounts((prevCounts) => ({
        ...prevCounts,
        collagesCount: Math.max(prevCounts.collagesCount - 1, 0),
      }));

      // Save collages and counts to cache
      await saveMetadataToCache(COLLAGES_CACHE_KEY, updatedCollages);
      await saveMetadataToCache(COUNTS_CACHE_KEY, {
        ...counts,
        collagesCount: Math.max(counts.collagesCount - 1, 0),
      });

      // Manage thumbnails after removing a collage
      await manageCollageThumbnails();
    } catch (error) {
      console.error("Error removing collage:", error);
    }
  };

  // === Repost State Management ===

  const addRepost = async (repost) => {
    try {
      // Add the new repost to the state
      const updatedReposts = [...reposts, repost];
      setReposts(updatedReposts);

      // Save reposts to cache
      await saveMetadataToCache(REPOSTS_CACHE_KEY, updatedReposts);

      // Manage thumbnails after adding a repost
      await manageRepostThumbnails();
    } catch (error) {
      console.error("Error adding repost:", error);
    }
  };

  const removeRepost = async (repostId) => {
    try {
      // Remove the repost from the state
      const updatedReposts = reposts.filter((r) => r._id !== repostId);
      setReposts(updatedReposts);

      // Save reposts to cache
      await saveMetadataToCache(REPOSTS_CACHE_KEY, updatedReposts);

      // Manage thumbnails after removing a repost
      await manageRepostThumbnails();
    } catch (error) {
      console.error("Error removing repost:", error);
    }
  };

  // === Moment State Management ===

  const addMoment = async (momentInput) => {
    try {
      // Perform the mutation to create a new moment
      const { data } = await postMomentMutation({
        variables: { cameraShotId: momentInput.cameraShotId },
      });

      if (data?.postMoment?.success) {
        // Create the new moment object
        const moment = {
          _id: data.postMoment._id,
          createdAt: data.postMoment.createdAt,
          expiresAt: data.postMoment.expiresAt,
        };

        // Update the moments state
        const updatedMoments = [...moments, moment];
        setMoments(updatedMoments);

        // Set active moments flag
        setHasActiveMoments(true);

        // Save updated moments to cache
        await saveMetadataToCache(MOMENTS_CACHE_KEY, updatedMoments);
      } else {
        console.error("Failed to add moment:", data?.postMoment?.message);
      }
    } catch (error) {
      console.error("Error posting moment:", error);
      throw new Error("Failed to post moment.");
    }
  };

  const removeMoment = async (momentId) => {
    try {
      // Perform the mutation to delete the moment
      const { data } = await deleteMomentMutation({ variables: { momentId } });

      if (data?.deleteMoment?.success) {
        // Filter the removed moment out of the state
        const updatedMoments = moments.filter((m) => m._id !== momentId);
        setMoments(updatedMoments);

        // Update active moments flag
        const hasActive = updatedMoments.some(
          (m) => new Date(m.expiresAt) > new Date()
        );
        setHasActiveMoments(hasActive);

        // Save updated moments to cache
        await saveMetadataToCache(MOMENTS_CACHE_KEY, updatedMoments);
      } else {
        console.error("Failed to delete moment:", data?.deleteMoment?.message);
      }
    } catch (error) {
      console.error("Error deleting moment:", error);
      throw new Error("Failed to delete moment.");
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

  const manageThumbnails = async (items, prefix, getImageKey) => {
    const MAX_THUMBNAILS = 15;

    try {
      // Extract the first 15 items
      const prioritizedItems = items.slice(0, MAX_THUMBNAILS);

      // Save thumbnails for the first 15 items
      for (const item of prioritizedItems) {
        const imageKey = getImageKey(item);
        const existingThumbnail = await getImageFromFileSystem(imageKey);

        if (!existingThumbnail) {
          await saveImageToFileSystem(imageKey, item.coverImage);
        }
      }

      // Remove thumbnails not in the first 15
      const cachedKeys = await getCachedThumbnailKeys(prefix);
      const prioritizedKeys = prioritizedItems.map(getImageKey);

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
      console.error(`Error managing thumbnails for prefix "${prefix}":`, error);
    }
  };

  const manageCollageThumbnails = async () => {
    await manageThumbnails(
      collages,
      "collage_thumbnail_",
      (collage) => `collage_thumbnail_${collage._id}`
    );
  };

  const manageRepostThumbnails = async () => {
    await manageThumbnails(
      reposts,
      "repost_thumbnail_",
      (repost) => `repost_thumbnail_${repost._id}`
    );
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

  // Initialization
  const initializeCachedData = async () => {
    // Fetch Admin Profile
    let cachedAdminProfile = await getMetadataFromCache(PROFILE_CACHE_KEY);
    if (!cachedAdminProfile) {
      cachedAdminProfile = await fetchAdminProfile();
      await saveMetadataToCache(
        PROFILE_CACHE_KEY,
        cachedAdminProfile,
        true,
        TTL_USER_DATA
      );
    }
    setAdminProfile(cachedAdminProfile);
    setOriginalAdminProfile(cachedAdminProfile);

    // Fetch Profile Picture
    let cachedProfilePictureUri = await getImageFromFileSystem(
      PROFILE_PICTURE_KEY,
      TTL_USER_DATA
    );
    if (!cachedProfilePictureUri) {
      cachedProfilePictureUri = await saveImageToFileSystem(
        PROFILE_PICTURE_KEY,
        cachedAdminProfile.profilePicture,
        true,
        TTL_USER_DATA
      );
    }
    setProfilePictureUri(cachedProfilePictureUri);

    // Fetch Counts
    let cachedCounts = await getMetadataFromCache(COUNTS_CACHE_KEY);
    if (!cachedCounts) {
      cachedCounts = await fetchUserCounts();
      await saveMetadataToCache(
        COUNTS_CACHE_KEY,
        cachedCounts,
        true,
        TTL_USER_COUNTS
      );
    }
    setCounts(cachedCounts);

    // Fetch Collages, Reposts, and Moments
    let cachedCollages = await getMetadataFromCache(COLLAGES_CACHE_KEY);
    if (!cachedCollages) {
      const { collages: fetchedCollages } = await fetchCollagesRepostsMoments();
      cachedCollages = fetchedCollages;
      await saveMetadataToCache(
        COLLAGES_CACHE_KEY,
        cachedCollages,
        true,
        TTL_COLLAGES_REPOSTS_MOMENTS
      );
    }
    setCollages(cachedCollages.items || []);
    setCollagesCursor(cachedCollages.nextCursor);
    setHasNextCollagesPage(cachedCollages.hasNextPage);

    // Manage thumbnails for collages
    await manageCollageThumbnails();

    let cachedReposts = await getMetadataFromCache(REPOSTS_CACHE_KEY);
    if (!cachedReposts) {
      const { repostedCollages: fetchedReposts } =
        await fetchCollagesRepostsMoments();
      cachedReposts = fetchedReposts;
      await saveMetadataToCache(
        REPOSTS_CACHE_KEY,
        cachedReposts,
        true,
        TTL_COLLAGES_REPOSTS_MOMENTS
      );
    }
    setReposts(cachedReposts.items || []);
    setRepostsCursor(cachedReposts.nextCursor);
    setHasNextRepostsPage(cachedReposts.hasNextPage);

    // Manage thumbnails for reposts
    await manageRepostThumbnails();

    let cachedMoments = await getMetadataFromCache(MOMENTS_CACHE_KEY);
    if (!cachedMoments) {
      const { moments: fetchedMoments } = await fetchCollagesRepostsMoments();
      cachedMoments = fetchedMoments;
      await saveMetadataToCache(
        MOMENTS_CACHE_KEY,
        cachedMoments,
        true,
        TTL_COLLAGES_REPOSTS_MOMENTS
      );
    }
    setMoments(cachedMoments || []);
    setHasActiveMoments(
      cachedMoments.some((moment) => new Date(moment.expiresAt) > new Date())
    );
  };

  useEffect(() => {
    initializeCachedData();
  }, []);

  return (
    <AdminProfileContext.Provider
      value={{
        adminProfile,
        originalAdminProfile,
        unsavedChanges,
        updateAdminProfileField,
        saveAdminProfile,
        resetAdminChanges,
        profilePictureUri,
        counts,
        collages,
        reposts,
        moments,
        hasActiveMoments,
        collagesCursor,
        repostsCursor,
        hasNextCollagesPage,
        hasNextRepostsPage,
        setCollages,
        setReposts,
        setMoments,
        setCounts,
        setCollagesCursor,
        setRepostsCursor,
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
