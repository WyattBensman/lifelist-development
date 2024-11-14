import React, { useEffect, useRef, useState } from "react";
import { Animated, Text, View, FlatList, StyleSheet } from "react-native";
import { iconStyles, layoutStyles } from "../../../styles";
import ProfileOverview from "../Components/ProfileOverview";
import CustomProfileNavigator from "../Navigators/CustomProfileNavigator";
import AdminOptionsPopup from "../Popups/AdminOptionsPopup";
import DefaultOptionsPopup from "../Popups/DefaultOptionsPopup";
import { useNavigation, useRoute } from "@react-navigation/native";
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
  saveImageToCache,
} from "../../../utils/cacheHelper";
import HeaderStack from "../../../components/Headers/HeaderStack";

export default function AdminProfile() {
  const navigation = useNavigation();
  const { currentUser } = useAuth();
  const [optionsPopupVisible, setOptionsPopupVisible] = useState(false);
  const [cachedProfile, setCachedProfile] = useState(null);
  const [followerData, setFollowerData] = useState(null);
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const route = useRoute();

  const userId = route.params?.userId;
  console.log(userId);

  const cacheKeys = {
    fullName: `profile_fullName_${userId}`,
    username: `profile_username_${userId}`,
    bio: `profile_bio_${userId}`,
    profilePicture: `profile_picture_${userId}`,
    collagesCount: `profile_collagesCount_${userId}`,
    followersCount: `profile_followersCount_${userId}`,
    followingCount: `profile_followingCount_${userId}`,
    countsTimestamp: `profile_countsTimestamp_${userId}`,
    collageMetadataKeys: `collage_metadata_keys_${userId}`,
    repostMetadataKeys: `repost_metadata_keys_${userId}`,
  };

  // TTL for counts (in milliseconds)
  const COUNTS_TTL = 15 * 60 * 1000; // 15 minutes
  const COLLAGE_TTL = 24 * 60 * 60 * 1000; // 24 hours
  const METADATA_TTL = 3 * 24 * 60 * 60 * 1000; // 3 days
  const PROFILE_PICTURE_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days

  // Fetch profile data from server
  const { data, loading, error } = useQuery(GET_USER_PROFILE, {
    variables: { userId: userId },
    skip: !!cachedProfile, // Skip fetching if cached profile exists
  });

  // Fetch counts from server
  const { data: countsData, refetch: refetchCounts } = useQuery(
    GET_USER_COUNTS,
    {
      variables: { userId: userId },
      skip: !!followerData, // Skip if cached counts exist
    }
  );

  // Load cached data on load
  useEffect(() => {
    const loadCachedData = async () => {
      try {
        // Load static profile data
        const [
          fullName,
          username,
          bio,
          profilePicture,
          followersCount,
          followingCount,
          collagesCount,
          countsTimestamp,
          collageMetadataKeys,
          repostMetadataKeys,
        ] = await Promise.all([
          getFromAsyncStorage(cacheKeys.fullName),
          getFromAsyncStorage(cacheKeys.username),
          getFromAsyncStorage(cacheKeys.bio),
          getImageFromFileSystem(cacheKeys.profilePicture),
          getFromAsyncStorage(`${cacheKeys.profilePicture}_timestamp`),
          getFromAsyncStorage(cacheKeys.followersCount),
          getFromAsyncStorage(cacheKeys.followingCount),
          getFromAsyncStorage(cacheKeys.collagesCount),
          getFromAsyncStorage(cacheKeys.countsTimestamp),
          getFromAsyncStorage(cacheKeys.collageMetadataKeys),
          getFromAsyncStorage(cacheKeys.repostMetadataKeys),
        ]);

        const now = Date.now();

        const profilePictureValid =
          profilePicture && profilePictureTimestamp
            ? now - profilePictureTimestamp < PROFILE_PICTURE_TTL
            : false;

        const countsAreValid =
          followersCount !== null &&
          followingCount !== null &&
          collagesCount !== null &&
          countsTimestamp &&
          now - countsTimestamp < COUNTS_TTL;

        // Load collages and reposts metadata
        const collages = [];
        const repostedCollages = [];

        for (let key of collageMetadataKeys) {
          const metadata = await getFromAsyncStorage(key);
          const metadataTimestamp = await getFromAsyncStorage(
            `${key}_timestamp`
          );
          const collageUri = await getImageFromFileSystem(
            `collage_cover_${metadata?.id}`
          );
          if (
            metadata &&
            collageUri &&
            metadataTimestamp &&
            now - metadataTimestamp < METADATA_TTL
          ) {
            collages.push({ ...metadata, coverImage: collageUri });
          }
        }

        for (let key of repostMetadataKeys) {
          const metadata = await getFromAsyncStorage(key);
          const metadataTimestamp = await getFromAsyncStorage(
            `${key}_timestamp`
          );
          const repostUri = await getImageFromFileSystem(
            `repost_cover_${metadata?.id}`
          );
          if (
            metadata &&
            repostUri &&
            metadataTimestamp &&
            now - metadataTimestamp < METADATA_TTL
          ) {
            repostedCollages.push({ ...metadata, coverImage: repostUri });
          }
        }

        // Log loaded collages and reposts
        console.log("Loaded Collages:", collages);
        console.log("Loaded Reposted Collages:", repostedCollages);

        // Set cached profile if data is present
        if (fullName && username && bio && profilePicture) {
          const cachedData = {
            fullName,
            username,
            bio,
            profilePicture,
            collages,
            repostedCollages,
          };

          setCachedProfile(cachedData);
          console.log("Cached Profile Set:", cachedData);
        }

        // Set follower data or refetch counts
        if (countsAreValid) {
          setFollowerData({ followersCount, followingCount, collagesCount });
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
          // Save profile picture
          const profilePictureUri = await saveImageToFileSystem(
            cacheKeys.profilePicture,
            profile.profilePicture,
            PROFILE_PICTURE_TTL
          );

          // Cache collages and reposts
          const collageMetadataKeys = [];
          for (let collage of profile.collages) {
            const collageUri = await saveImageToFileSystem(
              `collage_cover_${collage._id}`,
              collage.coverImage,
              COLLAGE_TTL
            );
            const key = `collage_metadata_${collage._id}`;
            collageMetadataKeys.push(key);
            saveToAsyncStorage(
              key,
              { id: collage._id, coverImage: collageUri },
              METADATA_TTL
            );
          }

          const repostMetadataKeys = [];
          for (let repost of profile.repostedCollages) {
            const repostUri = await saveImageToCache(
              `repost_cover_${repost._id}`,
              repost.coverImage,
              COLLAGE_TTL
            );
            const key = `repost_metadata_${repost._id}`;
            repostMetadataKeys.push(key);
            saveToAsyncStorage(
              key,
              { id: repost._id, coverImage: repostUri },
              METADATA_TTL
            );
          }

          saveToAsyncStorage(
            `collage_metadata_keys_${userId}`,
            collageMetadataKeys
          );
          saveImageToCache(
            `repost_metadata_keys_${userId}`,
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
          console.log("Cached Profile Updated:", cachedData);

          // Save other profile information to AsyncStorage
          saveToAsyncStorage(cacheKeys.fullName, profile.fullName);
          saveToAsyncStorage(cacheKeys.username, profile.username);
          saveToAsyncStorage(cacheKeys.bio, profile.bio);
        } catch (error) {
          console.error("Error updating profile picture cache:", error);
        }
      };
      updateCachedProfile();
    }
  }, [data, cachedProfile]);

  // Cache counts data if fetched
  useEffect(() => {
    if (countsData && !followerData) {
      const { followersCount, followingCount, collagesCount } =
        countsData.getUserCounts;

      setFollowerData({ followersCount, followingCount, collagesCount });

      saveToAsyncStorage(cacheKeys.followersCount, followersCount);
      saveToAsyncStorage(cacheKeys.followingCount, followingCount);
      saveToAsyncStorage(cacheKeys.collagesCount, collagesCount);
      saveToAsyncStorage(cacheKeys.countsTimestamp, Date.now());
    }
  }, [countsData, followerData]);

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
  const isAdminView = userId === currentUser;

  return (
    <View style={layoutStyles.wrapper}>
      {/* Fixed Header */}
      <HeaderStack
        arrow={
          <Icon
            name="chevron.backward"
            onPress={() => navigation.goBack()}
            style={iconStyles.backArrow}
            weight="semibold"
          />
        }
        title={profile.fullName}
        button1={
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
        data={[{ key: "profile" }]}
        keyExtractor={(item) => item.key}
        renderItem={() => (
          <>
            <ProfileOverview
              profile={profile}
              userId={userId}
              followerData={
                followerData || {
                  followersCount: 0,
                  followingCount: 0,
                  collagesCount: 0,
                }
              }
              isAdminView={isAdminView}
              isAdminScreen={false}
            />
            <CustomProfileNavigator
              userId={userId}
              isAdmin={isAdminView}
              isAdminScreen={false}
              navigation={navigation}
              collages={profile?.collages || []}
              repostedCollages={profile?.repostedCollages || []}
            />
          </>
        )}
        style={layoutStyles.wrapper}
      />

      {/* Options Popup */}
      {isAdminView ? (
        <AdminOptionsPopup
          visible={optionsPopupVisible}
          onRequestClose={toggleOptionsPopup}
          navigation={navigation}
        />
      ) : (
        <DefaultOptionsPopup
          visible={optionsPopupVisible}
          onRequestClose={toggleOptionsPopup}
          navigation={navigation}
        />
      )}
    </View>
  );
}
