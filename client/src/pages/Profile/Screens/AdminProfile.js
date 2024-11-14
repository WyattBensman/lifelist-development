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
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const cacheKeys = {
    fullName: `profile_fullName_${currentUser}`,
    username: `profile_username_${currentUser}`,
    bio: `profile_bio_${currentUser}`,
    profilePicture: `profile_picture_${currentUser}`,
    collagesCount: `profile_collagesCount_${currentUser}`,
    followersCount: `profile_followersCount_${currentUser}`,
    followingCount: `profile_followingCount_${currentUser}`,
    countsTimestamp: `profile_countsTimestamp_${currentUser}`,
    collageMetadataKeys: `collage_metadata_keys_${currentUser}`,
    repostMetadataKeys: `repost_metadata_keys_${currentUser}`,
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
          getFromAsyncStorage(cacheKeys.followersCount),
          getFromAsyncStorage(cacheKeys.followingCount),
          getFromAsyncStorage(cacheKeys.collagesCount),
          getFromAsyncStorage(cacheKeys.countsTimestamp),
          getFromAsyncStorage(cacheKeys.collageMetadataKeys),
          getFromAsyncStorage(cacheKeys.repostMetadataKeys),
        ]);

        const countsAreValid =
          followersCount !== null &&
          followingCount !== null &&
          collagesCount !== null &&
          countsTimestamp &&
          Date.now() - countsTimestamp < COUNTS_TTL;

        // Load collages and reposts metadata
        const collages = [];
        const repostedCollages = [];

        for (let key of collageMetadataKeys) {
          const metadata = await getFromAsyncStorage(key);
          const collageUri = await getImageFromFileSystem(
            `collage_cover_${metadata.id}`
          );
          if (metadata && collageUri) {
            collages.push({ ...metadata, coverImage: collageUri });
          }
        }

        for (let key of repostMetadataKeys) {
          const metadata = await getFromAsyncStorage(key);
          const repostUri = await getImageFromFileSystem(
            `repost_cover_${metadata.id}`
          );
          if (metadata && repostUri) {
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
            profile.profilePicture
          );

          // Cache collages and reposts
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

          const repostMetadataKeys = [];
          for (let repost of profile.repostedCollages) {
            const repostUri = await saveImageToFileSystem(
              `repost_cover_${repost._id}`,
              repost.coverImage
            );
            const key = `repost_metadata_${repost._id}`;
            repostMetadataKeys.push(key);
            saveToAsyncStorage(key, { id: repost._id, coverImage: repostUri });
          }

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
              followerData || {
                followersCount: 0,
                followingCount: 0,
                collagesCount: 0,
              }
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
