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

export default function AdminProfile() {
  const navigation = useNavigation();
  const { currentUser } = useAuth();
  const [optionsPopupVisible, setOptionsPopupVisible] = useState(false);
  const [cachedProfile, setCachedProfile] = useState(null);
  const [followerData, setFollowerData] = useState(null);
  const [collages, setCollages] = useState([]);
  const [repostedCollages, setRepostedCollages] = useState([]);
  const [collagesCursor, setCollagesCursor] = useState(null);
  const [repostsCursor, setRepostsCursor] = useState(null);
  const [hasMoreCollages, setHasMoreCollages] = useState(true);
  const [hasMoreReposts, setHasMoreReposts] = useState(true);
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
  const { data, loading, error } = useQuery(GET_USER_PROFILE, {
    variables: { userId: currentUser },
    skip: !!cachedProfile, // Skip fetching if cached profile exists
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

        // Load Collages and Reposts with their cover images
        const collages = [];
        const repostedCollages = [];

        // Check if collages and reposts are already cached and load them
        const collageMetadataKeys =
          (await getFromAsyncStorage(`collage_metadata_keys_${currentUser}`)) ||
          [];

        for (let key of collageMetadataKeys) {
          const metadata = await getFromAsyncStorage(key);
          const coverImageUri = await getImageFromFileSystem(
            `collage_cover_${metadata.id}`
          );
          if (metadata && coverImageUri) {
            collages.push({ ...metadata, coverImage: coverImageUri });
          }
        }

        const repostMetadataKeys =
          (await getFromAsyncStorage(`repost_metadata_keys_${currentUser}`)) ||
          [];

        for (let key of repostMetadataKeys) {
          const metadata = await getFromAsyncStorage(key);
          const coverImageUri = await getImageFromFileSystem(
            `repost_cover_${metadata.id}`
          );
          if (metadata && coverImageUri) {
            repostedCollages.push({ ...metadata, coverImage: coverImageUri });
          }
        }

        // Set cached profile if all data is present
        if (
          fullName &&
          username &&
          bio &&
          profilePictureUri &&
          collagesCount !== null
        ) {
          setCachedProfile({
            fullName,
            username,
            bio,
            profilePicture: profilePictureUri,
            collagesCount,
            collages,
            repostedCollages,
          });
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
          refetchCounts(); // Refetch if TTL has expired or no cached data
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
          // Save the profile picture to the file system if not already cached
          const profilePictureUri = await saveImageToFileSystem(
            `profile_picture_${currentUser}`,
            profile.profilePicture
          );

          // Cache collages and reposts metadata and images
          const collageMetadataKeys = [];
          for (let collage of profile.collages) {
            const collageUri = await saveImageToFileSystem(
              `collage_cover_${collage._id}`,
              collage.coverImage
            );
            console.log("Collage Cached at:", collageUri);

            const key = `collage_metadata_${collage._id}`;
            collageMetadataKeys.push(key);
            saveToAsyncStorage(key, {
              id: collage._id,
              coverImage: collageUri,
            });
          }

          const repostMetadataKeys = [];
          for (let repost of profile.repostedCollages) {
            const repostUri = await saveImageToFileSystem(
              `repost_cover_${repost._id}`,
              repost.coverImage
            );
            console.log("Repost Cached at:", repostUri);

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
          setCachedProfile({
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
          });

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
    }
  }, [countsData, followerData]);

  // EVENTUALLY IMPORT & REUSE THIS THROUGHOUT PROJECT
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

  const collagesData = [{ key: "Collages", component: CustomProfileNavigator }];

  const profile = cachedProfile || data?.getUserProfileById;
  const isAdminView = true;

  console.log("Cached Profile:", cachedProfile);
  console.log("Cached Collages:", cachedProfile?.collages);
  console.log("Cached Reposts:", cachedProfile?.repostedCollages);

  return (
    <View style={layoutStyles.wrapper}>
      <HeaderMain
        titleComponent={
          <Text style={headerStyles.headerHeavy}>{profile.fullName}</Text>
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
        data={collagesData}
        keyExtractor={(item) => item.key}
        renderItem={() => (
          <CustomProfileNavigator
            userId={currentUser}
            isAdmin={true}
            isAdminScreen={true}
            navigation={navigation}
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
