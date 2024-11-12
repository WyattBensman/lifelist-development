import React, { useState, useEffect, useRef } from "react";
import { Text, View, Animated, FlatList } from "react-native";
import { headerStyles, iconStyles, layoutStyles } from "../../../styles";
import HeaderMain from "../../../components/Headers/HeaderMain";
import ProfileOverview from "../Components/ProfileOverview";
import CustomProfileNavigator from "../Navigators/CustomProfileNavigator";
import AdminOptionsPopup from "../Popups/AdminOptionsPopup";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../../contexts/AuthContext";
import { useQuery } from "@apollo/client";
import {
  GET_USER_PROFILE,
  GET_USER_COUNTS,
} from "../../../utils/queries/userQueries";
import Icon from "../../../components/Icons/Icon";
import {
  saveToAsyncStorage,
  getFromAsyncStorage,
  saveImageToFileSystem,
  getImageFromFileSystem,
} from "../../../utils/cacheHelper";

const PAGE_SIZE = 20;

export default function AdminProfile() {
  const navigation = useNavigation();
  const { currentUser } = useAuth();
  const [optionsPopupVisible, setOptionsPopupVisible] = useState(false);
  const [cachedProfile, setCachedProfile] = useState(null);
  const [followerData, setFollowerData] = useState(null);
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const cacheKeys = {
    fullName: `profile_fullName_${currentUser}`,
    username: `profile_username_${currentUser}`,
    bio: `profile_bio_${currentUser}`,
    collagesCount: `profile_collagesCount_${currentUser}`,
    followersCount: `profile_followersCount_${currentUser}`,
    followingCount: `profile_followingCount_${currentUser}`,
    countsTimestamp: `profile_countsTimestamp_${currentUser}`,
  };

  // TTL for counts (in milliseconds)
  const COUNTS_TTL = 15 * 60 * 1000; // 15 minutes

  // Fetch profile data from server
  /* const { data, loading, error } = useQuery(GET_USER_PROFILE, {
    variables: { userId: currentUser },
    skip: !!cachedProfile, // Skip fetching if cached profile exists
  }); */
  const { data, loading, error, fetchMore } = useQuery(GET_USER_PROFILE, {
    variables: {
      userId: currentUser,
      collagesCursor: null,
      repostsCursor: null,
      limit: PAGE_SIZE,
    },
    fetchPolicy: "cache-and-network",
    onCompleted: (fetchedData) => {
      if (fetchedData) {
        const { collages: fetchedCollages, repostedCollages: fetchedReposts } =
          fetchedData.getUserProfileById;

        // Update collages and repostedCollages with pagination data
        setCollages(fetchedCollages.collages);
        setCollagesCursor(fetchedCollages.nextCursor);
        setHasMoreCollages(fetchedCollages.hasNextPage);

        setRepostedCollages(fetchedReposts.collages);
        setRepostsCursor(fetchedReposts.nextCursor);
        setHasMoreReposts(fetchedReposts.hasNextPage);
      }
    },
  });

  // Fetch counts from server
  const { data: countsData, refetch: refetchCounts } = useQuery(
    GET_USER_COUNTS,
    {
      variables: { userId: currentUser },
      skip: !!followerData, // Skip if cached counts exist
    }
  );

  // Retrieve cached data on load
  useEffect(() => {
    const loadCachedData = async () => {
      try {
        // Load Basic Profile Information
        const fullName = await getFromAsyncStorage(cacheKeys.fullName);
        const username = await getFromAsyncStorage(cacheKeys.username);
        const bio = await getFromAsyncStorage(cacheKeys.bio);
        const profilePictureUri = await getImageFromFileSystem(
          `profile_picture_${currentUser}`
        );
        const collagesCount = await getFromAsyncStorage(
          cacheKeys.collagesCount
        );

        // Log loaded basic profile information
        console.log("Loaded Basic Profile Info:", {
          fullName,
          username,
          bio,
          profilePictureUri,
          collagesCount,
        });

        // Load cached collages and reposts
        const collageMetadataKeys =
          (await getFromAsyncStorage(`collage_metadata_keys_${currentUser}`)) ||
          [];
        const repostMetadataKeys =
          (await getFromAsyncStorage(`repost_metadata_keys_${currentUser}`)) ||
          [];

        const cachedCollages = [];
        for (let key of collageMetadataKeys) {
          const metadata = await getFromAsyncStorage(key);
          const collageUri = await getImageFromFileSystem(
            `collage_cover_${metadata.id}`
          );
          if (metadata && collageUri) {
            cachedCollages.push({ ...metadata, coverImage: collageUri });
          }
        }

        const cachedReposts = [];
        for (let key of repostMetadataKeys) {
          const metadata = await getFromAsyncStorage(key);
          const repostUri = await getImageFromFileSystem(
            `repost_cover_${metadata.id}`
          );
          if (metadata && repostUri) {
            cachedReposts.push({ ...metadata, coverImage: repostUri });
          }
        }

        setCollages(cachedCollages);
        setRepostedCollages(cachedReposts);

        // Set cached profile if all data is present
        if (fullName && username && bio && profilePictureUri) {
          const cachedData = {
            fullName,
            username,
            bio,
            profilePicture: profilePictureUri,
            collagesCount,
          };
          setCachedProfile(cachedData);
          console.log("Cached Profile Set:", cachedData);
        }

        // Load Dynamic Profile Information with TTL check
        const followersCount = await getFromAsyncStorage(
          cacheKeys.followersCount
        );
        const followingCount = await getFromAsyncStorage(
          cacheKeys.followingCount
        );
        const countsTimestamp = await getFromAsyncStorage(
          cacheKeys.countsTimestamp
        );

        if (
          followersCount !== null &&
          followingCount !== null &&
          Date.now() - countsTimestamp < COUNTS_TTL
        ) {
          setFollowerData({ followersCount, followingCount });
        } else {
          refetchCounts();
        }
      } catch (error) {
        console.error("Error loading cached data:", error);
      }
    };

    loadCachedData();
  }, []);

  // Cache fetched data if no cached profile
  useEffect(() => {
    if (data && !cachedProfile) {
      const profile = data.getUserProfileById;

      const updateCachedProfile = async () => {
        try {
          // Save the profile picture to the file system
          const profilePictureUri = await saveImageToFileSystem(
            `profile_picture_${currentUser}`,
            profile.profilePicture
          );

          // Cache collages metadata and images
          const collageMetadataKeys = [];
          for (let collage of profile.collages) {
            const collageUri = await saveImageToFileSystem(
              `collage_cover_${collage._id}`,
              collage.coverImage
            );
            const key = `collage_metadata_${collage._id}`;
            collageMetadataKeys.push(key);
            saveToAsyncStorage(key, {
              id: collage._id,
              coverImage: collageUri,
            });
          }

          // Cache reposts metadata and images
          const repostMetadataKeys = [];
          for (let repost of profile.repostedCollages) {
            const repostUri = await saveImageToFileSystem(
              `repost_cover_${repost._id}`,
              repost.coverImage
            );
            const key = `repost_metadata_${repost._id}`;
            repostMetadataKeys.push(key);
            saveToAsyncStorage(key, {
              id: repost._id,
              coverImage: repostUri,
            });
          }

          // Save metadata keys for easy retrieval
          saveToAsyncStorage(
            `collage_metadata_keys_${currentUser}`,
            collageMetadataKeys
          );
          saveToAsyncStorage(
            `repost_metadata_keys_${currentUser}`,
            repostMetadataKeys
          );

          // Update cached profile
          const cachedData = {
            ...profile,
            profilePicture: profilePictureUri,
            collages: profile.collages.map((c, i) => ({
              ...c,
              coverImage: collageMetadataKeys[i],
            })),
            repostedCollages: profile.repostedCollages.map((r, i) => ({
              ...r,
              coverImage: repostMetadataKeys[i],
            })),
          };
          setCachedProfile(cachedData);

          // Save other profile information to AsyncStorage
          saveToAsyncStorage(cacheKeys.fullName, profile.fullName);
          saveToAsyncStorage(cacheKeys.username, profile.username);
          saveToAsyncStorage(cacheKeys.bio, profile.bio);
          saveToAsyncStorage(cacheKeys.collagesCount, profile.collagesCount);
        } catch (error) {
          console.error("Error updating profile picture cache:", error);
        }
      };
      updateCachedProfile();
    }
  }, [data, cachedProfile]);

  // Cache Follower and Following Counts after fetch
  useEffect(() => {
    if (countsData && !followerData) {
      const { followersCount, followingCount } = countsData.getUserCounts;
      setFollowerData({ followersCount, followingCount });

      // Save counts and timestamp to AsyncStorage
      saveToAsyncStorage(cacheKeys.followersCount, followersCount);
      saveToAsyncStorage(cacheKeys.followingCount, followingCount);
      saveToAsyncStorage(cacheKeys.countsTimestamp, Date.now());
      console.log("Follower and Following Counts Cached:", {
        followersCount,
        followingCount,
      });
    }
  }, [countsData, followerData]);

  // Pagination: Load more collages
  const loadMoreCollages = async () => {
    if (!hasMoreCollages || loading) return;

    await fetchMore({
      variables: {
        userId: currentUser,
        collagesCursor,
        limit: PAGE_SIZE,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;

        const newCollages =
          fetchMoreResult.getUserProfileById.collages.collages;

        setCollages((prevCollages) => [...prevCollages, ...newCollages]);
        setCollagesCursor(
          fetchMoreResult.getUserProfileById.collages.nextCursor
        );
        setHasMoreCollages(
          fetchMoreResult.getUserProfileById.collages.hasNextPage
        );

        return fetchMoreResult;
      },
    });
  };

  // Pagination: Load more reposted collages
  const loadMoreReposts = async () => {
    if (!hasMoreReposts || loading) return;

    await fetchMore({
      variables: {
        userId: currentUser,
        repostsCursor,
        limit: PAGE_SIZE,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;

        const newReposts =
          fetchMoreResult.getUserProfileById.repostedCollages.collages;

        setRepostedCollages((prevReposts) => [...prevReposts, ...newReposts]);
        setRepostsCursor(
          fetchMoreResult.getUserProfileById.repostedCollages.nextCursor
        );
        setHasMoreReposts(
          fetchMoreResult.getUserProfileById.repostedCollages.hasNextPage
        );

        return fetchMoreResult;
      },
    });
  };

  // Animate rotation
  useEffect(() => {
    Animated.timing(rotateAnim, {
      toValue: optionsPopupVisible ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [optionsPopupVisible]);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "90deg"],
  });

  const toggleOptionsPopup = () => {
    setOptionsPopupVisible(!optionsPopupVisible);
  };

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  const profile = cachedProfile || data?.getUserProfileById;
  const isAdminView = true;

  return (
    <View style={layoutStyles.wrapper}>
      <HeaderMain
        titleComponent={
          <Text style={headerStyles.headerHeavy}>{profile?.fullName}</Text>
        }
        icon1={
          <Animated.View style={{ transform: [{ rotate: rotation }] }}>
            <Icon
              name="ellipsis"
              style={iconStyles.ellipsis}
              weight="bold"
              onPress={toggleOptionsPopup}
            />
          </Animated.View>
        }
      />

      {/* Scrollable Content */}
      <FlatList
        data={[{ key: "Collages", component: CustomProfileNavigator }]}
        keyExtractor={(item) => item.key}
        renderItem={() => (
          <CustomProfileNavigator
            userId={currentUser}
            isAdmin={true}
            isAdminScreen={true}
            navigation={navigation}
            collages={profile?.collages || []}
            repostedCollages={profile?.repostedCollages || []}
          />
        )}
        ListHeaderComponent={() => (
          <ProfileOverview
            profile={profile}
            userId={currentUser}
            followerData={
              followerData || { followersCount: 0, followingCount: 0 }
            }
            isAdminView={isAdminView}
            isAdminScreen={true}
          />
        )}
        style={layoutStyles.wrapper}
      />

      <AdminOptionsPopup
        visible={optionsPopupVisible}
        onRequestClose={toggleOptionsPopup}
        navigation={navigation}
      />
    </View>
  );
}
