import React, { useCallback, useEffect, useRef, useState } from "react";
import { Animated, Text, View, FlatList, StyleSheet } from "react-native";
import { iconStyles, layoutStyles } from "../../../styles";
import ProfileOverview from "../Components/ProfileOverview";
import CustomProfileNavigator from "../Navigators/CustomProfileNavigator";
import AdminOptionsPopup from "../Popups/AdminOptionsPopup";
import DefaultOptionsPopup from "../Popups/DefaultOptionsPopup";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useAuth } from "../../../contexts/AuthContext";
import { useQuery } from "@apollo/client";
import { GET_USER_PROFILE } from "../../../utils/queries/userQueries";
import HeaderStack from "../../../components/Headers/HeaderStack";
import Icon from "../../../components/Icons/Icon";
import {
  saveImageToCache,
  saveToAsyncStorage,
  getFromAsyncStorage,
  saveImageToFileSystem,
  getImageFromFileSystem,
} from "../../../utils/cacheHelper";

export default function Profile() {
  const navigation = useNavigation();
  const route = useRoute();
  const { currentUser } = useAuth();
  const [optionsPopupVisible, setOptionsPopupVisible] = useState(false);
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const userId = route.params?.userId;

  // Cache keys
  const cacheKeys = {
    fullName: `profile_fullName_${userId}`,
    username: `profile_username_${userId}`,
    bio: `profile_bio_${userId}`,
    profilePicture: `profile_picture_${userId}`,
    counts: `profile_counts_${userId}`,
    countsTimestamp: `profile_counts_timestamp_${userId}`,
    collages: `collages_metadata_${userId}`,
    reposts: `reposts_metadata_${userId}`,
  };

  const COUNTS_TTL = 15 * 60 * 1000; // 15 minutes
  const COLLAGE_TTL = 24 * 60 * 60 * 1000; // 24 hours
  const METADATA_TTL = 3 * 24 * 60 * 60 * 1000; // 3 days
  const PROFILE_PICTURE_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days

  // State management
  const [cachedProfile, setCachedProfile] = useState(null);
  const [cachedCounts, setCachedCounts] = useState(null);
  const [cachedCollages, setCachedCollages] = useState({
    collages: [],
    reposts: [],
  });
  const [isFollowing, setIsFollowing] = useState(null);

  // Queries
  const { data, loading, error } = useQuery(GET_USER_PROFILE, {
    variables: { userId },
    skip: !!cachedProfile,
  });

  const { data: countsData, refetch: refetchCounts } = useQuery(
    GET_USER_COUNTS,
    {
      variables: { userId },
      skip: !!cachedCounts,
    }
  );

  const { data: isFollowingData } = useQuery(IS_FOLLOWING, {
    variables: { userId },
    skip: isFollowing !== null,
  });

  // Load cached data on mount
  useEffect(() => {
    const loadCachedData = async () => {
      try {
        // Load profile data
        const fullName = await getFromAsyncStorage(cacheKeys.fullName);
        const username = await getFromAsyncStorage(cacheKeys.username);
        const bio = await getFromAsyncStorage(cacheKeys.bio);
        const profilePicture = await getImageFromFileSystem(
          cacheKeys.profilePicture
        );

        // Load collages and reposts
        const collages = (await getFromAsyncStorage(cacheKeys.collages)) || [];
        const reposts = (await getFromAsyncStorage(cacheKeys.reposts)) || [];

        // Set cached profile and collages
        if (fullName && username && bio && profilePicture) {
          setCachedProfile({ fullName, username, bio, profilePicture });
        }
        setCachedCollages({ collages, reposts });

        // Load counts with TTL validation
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

  // Cache profile data
  useEffect(() => {
    if (data && !cachedProfile) {
      const { getUserProfileById: profile } = data;

      const cacheProfileData = async () => {
        try {
          const profilePicture = await saveImageToFileSystem(
            cacheKeys.profilePicture,
            profile.profilePicture,
            PROFILE_PICTURE_TTL
          );

          const collages = await Promise.all(
            profile.collages.map(async (collage) => {
              const coverImage = await saveImageToCache(
                `collage_cover_${collage._id}`,
                collage.coverImage
              );
              return { ...collage, coverImage };
            })
          );

          const reposts = await Promise.all(
            profile.repostedCollages.map(async (repost) => {
              const coverImage = await saveImageToCache(
                `repost_cover_${repost._id}`,
                repost.coverImage
              );
              return { ...repost, coverImage };
            })
          );

          await saveToAsyncStorage(
            cacheKeys.fullName,
            profile.fullName,
            METADATA_TTL
          );
          await saveToAsyncStorage(
            cacheKeys.username,
            profile.username,
            METADATA_TTL
          );
          await saveToAsyncStorage(cacheKeys.bio, profile.bio, METADATA_TTL);
          await saveToAsyncStorage(cacheKeys.collages, collages, COLLAGE_TTL);
          await saveToAsyncStorage(cacheKeys.reposts, reposts, COLLAGE_TTL);

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

  // Cache counts data
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

  // Update isFollowing state
  useEffect(() => {
    if (isFollowingData) {
      setIsFollowing(isFollowingData.checkIsFollowing.isFollowing);
    }
  }, [isFollowingData]);

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

  if (loading || !followingData) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  const profile = cachedProfile || data?.getUserProfileById;

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
              counts={
                cachedCounts || {
                  followersCount: 0,
                  followingCount: 0,
                  collagesCount: 0,
                }
              }
              isFollowing={isFollowing}
              isAdminView={false}
              isAdminScreen={false}
            />
            <CustomProfileNavigator
              userId={userId}
              isAdmin={false}
              isAdminScreen={false}
              navigation={navigation}
              collages={cachedCollages.collages}
              repostedCollages={cachedCollages.reposts}
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
