import React, { useRef, useEffect, useState } from "react";
import {
  Animated,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { iconStyles, layoutStyles } from "../../../styles";
import ProfileOverview from "../Components/ProfileOverview";
import CustomProfileNavigator from "../Navigators/CustomProfileNavigator";
import AdminOptionsPopup from "../Popups/AdminOptionsPopup";
import DefaultOptionsPopup from "../Popups/DefaultOptionsPopup";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useAuth } from "../../../contexts/AuthContext";
import { useProfile } from "../../../contexts/ProfileContext";
import Icon from "../../../components/Icons/Icon";
import HeaderStack from "../../../components/Headers/HeaderStack";

export default function Profile() {
  const navigation = useNavigation();
  const { currentUser } = useAuth();
  const {
    profiles,
    initializeProfileCache,
    refreshProfile,
    fetchMoreCollages,
    fetchMoreReposts,
  } = useProfile();

  const rotateAnim = useRef(new Animated.Value(0)).current;
  const route = useRoute();

  const userId = route.params?.userId || currentUser;
  const isAdminView = userId === currentUser;

  const [collagesCursor, setCollagesCursor] = useState(null);
  const [repostsCursor, setRepostsCursor] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Track overall loading state
  const [isLoadingCollages, setIsLoadingCollages] = useState(false); // Loading state for collages
  const [isLoadingReposts, setIsLoadingReposts] = useState(false); // Loading state for reposts
  const [refreshing, setRefreshing] = useState(false); // Track pull-to-refresh state
  const [error, setError] = useState(null);

  const [optionsPopupVisible, setOptionsPopupVisible] = useState(false);

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

  const toggleOptionsPopup = () => setOptionsPopupVisible(!optionsPopupVisible);

  // Initial Profile Cache Setup
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setIsLoading(true);
        await initializeProfileCache(userId); // Use initializeProfileCache for first load
      } catch (err) {
        console.error("Error initializing profile cache:", err);
        setError(err.message || "Failed to load profile.");
      } finally {
        setIsLoading(false);
      }
    };
    loadProfile();
  }, [userId]);

  const profile = profiles[userId];

  useEffect(() => {
    if (profile?.collages?.nextCursor) {
      setCollagesCursor(profile.collages.nextCursor);
    }
    if (profile?.repostedCollages?.nextCursor) {
      setRepostsCursor(profile.repostedCollages.nextCursor);
    }
  }, [profile]);

  const handleFetchMoreCollages = async () => {
    if (collagesCursor && !isLoadingCollages) {
      setIsLoadingCollages(true);
      try {
        await fetchMoreCollages(userId, collagesCursor);
      } catch (err) {
        console.error("Error fetching more collages:", err);
      } finally {
        setIsLoadingCollages(false);
      }
    }
  };

  const handleFetchMoreReposts = async () => {
    if (repostsCursor && !isLoadingReposts) {
      setIsLoadingReposts(true);
      try {
        await fetchMoreReposts(userId, repostsCursor);
      } catch (err) {
        console.error("Error fetching more reposts:", err);
      } finally {
        setIsLoadingReposts(false);
      }
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshProfile(userId); // Use refreshProfile for pull-to-refresh
    } catch (err) {
      console.error("Error refreshing profile during pull-to-refresh:", err);
    } finally {
      setRefreshing(false);
    }
  };

  if (isLoading) {
    return (
      <View style={[layoutStyles.wrapper, layoutStyles.center]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[layoutStyles.wrapper, layoutStyles.center]}>
        <Text style={{ color: "red" }}>{error}</Text>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={[layoutStyles.wrapper, layoutStyles.center]}>
        <Text>Profile not found.</Text>
      </View>
    );
  }

  const isRestricted =
    profile?.isBlocked || (profile?.isProfilePrivate && !profile?.isFollowing);

  return (
    <View style={layoutStyles.wrapper}>
      <HeaderStack
        arrow={
          <Icon
            name="chevron.backward"
            onPress={() => navigation.goBack()}
            style={iconStyles.backArrow}
            weight="semibold"
          />
        }
        title={profile?.fullName || ""}
        collages={profile?.collages?.items || []}
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
      <FlatList
        data={[{ key: "profile" }]}
        keyExtractor={(item) => item.key}
        renderItem={() => (
          <>
            <ProfileOverview
              profile={profile}
              userId={userId}
              followerData={{
                followersCount: profile?.followersCount || 0,
                followingCount: profile?.followingCount || 0,
                collagesCount:
                  profile?.collages?.items?.length ||
                  profile?.collagesCount ||
                  0,
              }}
              isAdminView={isAdminView}
              isAdminScreen={false}
              isRestricted={isRestricted}
            />
            {isRestricted ? (
              <View
                style={{
                  justifyContent: "center",
                  borderTopWidth: 1,
                  borderColor: "#252525",
                }}
              >
                <Text
                  style={{ fontSize: 16, padding: 16, textAlign: "center" }}
                >
                  {profile?.isBlocked
                    ? "You are blocked from viewing this profile."
                    : "This profile is private. Follow the user to view their content."}
                </Text>
              </View>
            ) : (
              <CustomProfileNavigator
                userId={userId}
                isAdmin={isAdminView}
                isAdminScreen={false}
                navigation={navigation}
                collages={profile?.collages?.items || []}
                repostedCollages={profile?.repostedCollages?.items || []}
                refreshProfile={handleRefresh}
                hasActiveMoments={profile?.hasActiveMoments}
                fetchMoreCollages={handleFetchMoreCollages}
                fetchMoreReposts={handleFetchMoreReposts}
                isLoadingCollages={isLoadingCollages}
                isLoadingReposts={isLoadingReposts}
              />
            )}
          </>
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#fff"
            colors={["#fff"]}
          />
        }
        style={layoutStyles.wrapper}
      />
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
          profileId={userId}
        />
      )}
    </View>
  );
}
