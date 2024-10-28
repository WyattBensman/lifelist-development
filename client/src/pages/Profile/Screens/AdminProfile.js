import React, { useCallback, useState, useEffect, useRef } from "react";
import { Text, View, Animated, FlatList, StyleSheet } from "react-native";
import { headerStyles, iconStyles, layoutStyles } from "../../../styles";
import HeaderMain from "../../../components/Headers/HeaderMain";
import ProfileOverview from "../Components/ProfileOverview";
import CustomProfileNavigator from "../Navigators/CustomProfileNavigator";
import AdminOptionsPopup from "../Popups/AdminOptionsPopup";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useAuth } from "../../../contexts/AuthContext";
import { useQuery } from "@apollo/client";
import { GET_USER_PROFILE } from "../../../utils/queries/userQueries";
import Icon from "../../../components/Icons/Icon";
import {
  saveToAsyncStorage,
  getFromAsyncStorage,
} from "../../../utils/cacheHelper";

export default function AdminProfile() {
  const navigation = useNavigation();
  const { currentUser } = useAuth();
  const [optionsPopupVisible, setOptionsPopupVisible] = useState(false);
  const [cachedProfile, setCachedProfile] = useState(null); // Store cached profile
  const rotateAnim = useRef(new Animated.Value(0)).current;

  // Fetch data from server
  const { data, loading, error, refetch } = useQuery(GET_USER_PROFILE, {
    variables: { userId: currentUser },
  });

  // Cache keys for AsyncStorage
  const cacheKeys = {
    fullName: `profile_fullName_${currentUser}`,
    username: `profile_username_${currentUser}`,
    bio: `profile_bio_${currentUser}`,
    profilePicture: `profile_profilePicture_${currentUser}`,
    collageCount: `profile_collageCount_${currentUser}`,
  };

  // Load cached data on mount
  useEffect(() => {
    const loadCachedProfile = async () => {
      try {
        const fullName = await getFromAsyncStorage(cacheKeys.fullName);
        const username = await getFromAsyncStorage(cacheKeys.username);
        const bio = await getFromAsyncStorage(cacheKeys.bio);
        const profilePicture = await getFromAsyncStorage(
          cacheKeys.profilePicture
        );
        const collageCount = await getFromAsyncStorage(cacheKeys.collageCount);

        // Set cached profile with collage count if exists
        setCachedProfile({
          fullName,
          username,
          bio,
          profilePicture,
          collageCount: collageCount ? parseInt(collageCount) : null,
        });
      } catch (error) {
        console.error("Failed to load profile from cache:", error);
      }
    };

    loadCachedProfile();
  }, []);

  // Cache profile data when data from server updates
  useEffect(() => {
    if (data && data.getUserProfileById) {
      const profile = data.getUserProfileById;
      const cacheProfileData = async () => {
        try {
          await saveToAsyncStorage(cacheKeys.fullName, profile.fullName || "");
          await saveToAsyncStorage(cacheKeys.username, profile.username || "");
          await saveToAsyncStorage(cacheKeys.bio, profile.bio || "");
          await saveToAsyncStorage(
            cacheKeys.profilePicture,
            profile.profilePicture || ""
          );
          await saveToAsyncStorage(
            cacheKeys.collageCount,
            profile.collages.length.toString()
          );

          setCachedProfile({
            fullName: profile.fullName,
            username: profile.username,
            bio: profile.bio,
            profilePicture: profile.profilePicture,
            collageCount: profile.collages.length,
          });
        } catch (error) {
          console.error("Failed to save profile to cache:", error);
        }
      };
      cacheProfileData();
    }
  }, [data]);

  useFocusEffect(
    useCallback(() => {
      refetch(); // Refresh data on focus
    }, [refetch])
  );

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

  const profile = data.getUserProfileById;
  const isAdminView = true;

  const collagesData = [
    { key: "Collages", component: CustomProfileNavigator },
    // Add other sections if needed
  ];

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
            userId={profile._id}
            isAdmin={true}
            isAdminScreen={true}
            navigation={navigation}
          />
        )}
        ListHeaderComponent={() => (
          <ProfileOverview
            profile={profile}
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
