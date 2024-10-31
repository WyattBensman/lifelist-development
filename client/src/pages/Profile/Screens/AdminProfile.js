import React, { useCallback, useState, useEffect, useRef } from "react";
import { Text, View, Animated, FlatList, StyleSheet } from "react-native";
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
  isTTLValid,
} from "../../../utils/cacheHelper";

export default function AdminProfile() {
  const navigation = useNavigation();
  const { currentUser } = useAuth();
  const [optionsPopupVisible, setOptionsPopupVisible] = useState(false);
  const [cachedProfile, setCachedProfile] = useState(null); // Store cached profile
  const [followerData, setFollowerData] = useState(null); // Store cached counts
  const rotateAnim = useRef(new Animated.Value(0)).current;

  // Cache keys for AsyncStorage
  const cacheKeys = {
    fullName: `profile_fullName_${currentUser}`,
    username: `profile_username_${currentUser}`,
    bio: `profile_bio_${currentUser}`,
    profilePicture: `profile_profilePicture_${currentUser}`,
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
        const profilePicture = await getFromAsyncStorage(
          cacheKeys.profilePicture
        );
        const collagesCount = await getFromAsyncStorage(
          cacheKeys.collagesCount
        );

        if (
          fullName &&
          username &&
          bio &&
          profilePicture &&
          collagesCount !== null
        ) {
          setCachedProfile({
            fullName,
            username,
            bio,
            profilePicture,
            collagesCount,
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
          isTTLValid(countsTimestamp, COUNTS_TTL)
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
      setCachedProfile(profile);

      // Save profile information to AsyncStorage
      saveToAsyncStorage(cacheKeys.fullName, profile.fullName);
      saveToAsyncStorage(cacheKeys.username, profile.username);
      saveToAsyncStorage(cacheKeys.bio, profile.bio);
      saveToAsyncStorage(cacheKeys.profilePicture, profile.profilePicture);
      saveToAsyncStorage(cacheKeys.collagesCount, profile.collagesCount);
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

  // EVENTUALLY IMPORT & REUSE THIS THROUGHOU PROJECT
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

  const collagesData = [
    { key: "Collages", component: CustomProfileNavigator },
    // Add other sections if needed
  ];

  const profile = cachedProfile || data.getUserProfileById;
  const isAdminView = true;

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
