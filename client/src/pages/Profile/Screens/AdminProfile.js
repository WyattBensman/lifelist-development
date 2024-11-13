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
  const [cachedCounts, setCachedCounts] = useState(null);
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const cacheKeys = {
    fullName: `profile_fullName_${currentUser}`,
    username: `profile_username_${currentUser}`,
    bio: `profile_bio_${currentUser}`,
    profilePicture: `profile_picture_${currentUser}`,
    counts: `profile_counts_${currentUser}`,
    countsTimestamp: `profile_counts_timestamp_${currentUser}`,
    collages: `collages_metadata_${currentUser}`,
    reposts: `reposts_metadata_${currentUser}`,
  };

  const COUNTS_TTL = 15 * 60 * 1000; // 15 minutes

  // Queries
  const { data, loading, error } = useQuery(GET_USER_PROFILE, {
    variables: { userId: currentUser },
    skip: !!cachedProfile, // Skip if cached profile exists
  });

  const { data: countsData, refetch: refetchCounts } = useQuery(
    GET_USER_COUNTS,
    {
      variables: { userId: currentUser },
      skip: !!cachedCounts, // Skip if cached counts exist
    }
  );

  // Load cached data on mount
  useEffect(() => {
    const loadCachedData = async () => {
      try {
        // Load basic profile metadata
        const fullName = await getFromAsyncStorage(cacheKeys.fullName);
        const username = await getFromAsyncStorage(cacheKeys.username);
        const bio = await getFromAsyncStorage(cacheKeys.bio);
        const profilePicture = await getImageFromFileSystem(
          cacheKeys.profilePicture
        );

        // Load collages and reposts metadata
        const collages = (await getFromAsyncStorage(cacheKeys.collages)) || [];
        const reposts = (await getFromAsyncStorage(cacheKeys.reposts)) || [];

        if (fullName && username && bio && profilePicture) {
          setCachedProfile({
            fullName,
            username,
            bio,
            profilePicture,
          });
        }

        setCachedCollages({ collages, reposts });

        // Load counts with TTL check
        const counts = await getFromAsyncStorage(cacheKeys.counts);
        const countsTimestamp = await getFromAsyncStorage(
          cacheKeys.countsTimestamp
        );

        const isCountsValid =
          countsTimestamp && Date.now() - countsTimestamp < COUNTS_TTL;

        if (counts && isCountsValid) {
          setCachedCounts(counts);
        } else {
          refetchCounts();
        }
      } catch (error) {
        console.error("Error loading cached data:", error);
      }
    };

    loadCachedData();
  }, []);

  // Cache profile data after fetch
  useEffect(() => {
    if (data && !cachedProfile) {
      const { getUserProfileById: profile } = data;

      const cacheProfileData = async () => {
        try {
          // Cache profile picture
          const profilePicture = await saveImageToFileSystem(
            cacheKeys.profilePicture,
            profile.profilePicture
          );

          // Cache collages and reposts metadata
          const collages = await Promise.all(
            profile.collages.map(async (collage) => {
              const coverImage = await saveImageToFileSystem(
                `collage_cover_${collage._id}`,
                collage.coverImage
              );
              return { ...collage, coverImage };
            })
          );

          const reposts = await Promise.all(
            profile.repostedCollages.map(async (repost) => {
              const coverImage = await saveImageToFileSystem(
                `repost_cover_${repost._id}`,
                repost.coverImage
              );
              return { ...repost, coverImage };
            })
          );

          await saveToAsyncStorage(cacheKeys.collages, collages);
          await saveToAsyncStorage(cacheKeys.reposts, reposts);

          // Cache profile metadata
          await saveToAsyncStorage(
            cacheKeys.fullName,
            profile.fullName,
            72 * 60 * 60
          );
          await saveToAsyncStorage(
            cacheKeys.username,
            profile.username,
            72 * 60 * 60
          );
          await saveToAsyncStorage(cacheKeys.bio, profile.bio, 72 * 60 * 60);

          setCachedProfile({
            fullName: profile.fullName,
            username: profile.username,
            bio: profile.bio,
            profilePicture,
          });

          setCachedCollages({ collages, reposts });
        } catch (error) {
          console.error("Error caching profile data:", error);
        }
      };

      cacheProfileData();
    }
  }, [data, cachedProfile]);

  // Cache counts data after fetch
  useEffect(() => {
    if (countsData && !cachedCounts) {
      const { followersCount, followingCount, collagesCount } =
        countsData.getUserCounts;

      const counts = { followersCount, followingCount, collagesCount };

      saveToAsyncStorage(cacheKeys.counts, counts, COUNTS_TTL);
      saveToAsyncStorage(cacheKeys.countsTimestamp, Date.now());

      setCachedCounts(counts);
    }
  }, [countsData, cachedCounts]);

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
          console.log("Profile Picture Cached at:", profilePictureUri);

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
          saveToAsyncStorage(cacheKeys.collagesCount, profile.collagesCount);
        } catch (error) {
          console.error("Error updating profile picture cache:", error);
        }
      };
      updateCachedProfile();
    }
  }, [data, cachedProfile]);

  // Cache Follower, Following, Collage Counts after fetch
  useEffect(() => {
    if (countsData && !cachedCounts) {
      const { followersCount, followingCount, collagesCount } =
        countsData.getUserCounts;

      const counts = { followersCount, followingCount, collagesCount };

      saveToAsyncStorage(cacheKeys.counts, counts, COUNTS_TTL);
      saveToAsyncStorage(cacheKeys.countsTimestamp, Date.now());

      setCachedCounts(counts);
    }
  }, [countsData, cachedCounts]);

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
            // collages={profile?.collages || []}
            // repostedCollages={profile?.repostedCollages || []}
            collages={cachedCollages.collages}
            repostedCollages={cachedCollages.reposts}
          />
        )}
        ListHeaderComponent={() => (
          <ProfileOverview
            profile={profile}
            userId={currentUser}
            counts={
              cachedCounts || {
                followersCount: 0,
                followingCount: 0,
                collagesCount: 0,
              }
            }
            isAdminView={true}
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
