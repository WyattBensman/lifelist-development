import React, { useRef, useEffect, useState } from "react";
import {
  Animated,
  Text,
  View,
  FlatList,
  ActivityIndicator,
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
    isProfileCacheInitialized,
    initializeProfileCache,
    fetchMoreCollages,
    fetchMoreReposts,
  } = useProfile();

  const rotateAnim = useRef(new Animated.Value(0)).current;
  const route = useRoute();

  const userId = route.params?.userId || currentUser;
  const isAdminView = userId === currentUser;

  const [collagesCursor, setCollagesCursor] = useState(null);
  const [repostsCursor, setRepostsCursor] = useState(null);
  const [isLoadingCollages, setIsLoadingCollages] = useState(false);
  const [isLoadingReposts, setIsLoadingReposts] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Track overall loading state
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

  // Initialize Profile Cache
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setIsLoading(true);
        await initializeProfileCache(userId);
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
      await fetchMoreCollages(userId, collagesCursor);
      setIsLoadingCollages(false);
    }
  };

  const handleFetchMoreReposts = async () => {
    if (repostsCursor && !isLoadingReposts) {
      setIsLoadingReposts(true);
      await fetchMoreReposts(userId, repostsCursor);
      setIsLoadingReposts(false);
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
                collagesCount: profile?.collagesCount || 0,
              }}
              isAdminView={isAdminView}
              isAdminScreen={false}
            />
            <CustomProfileNavigator
              userId={userId}
              isAdmin={isAdminView}
              isAdminScreen={false}
              navigation={navigation}
              collages={profile?.collages?.items || []}
              repostedCollages={profile?.repostedCollages?.items || []}
              refreshProfile={() => initializeProfileCache(userId)}
              hasActiveMoments={profile?.hcodyasActiveMoments}
              fetchMoreCollages={handleFetchMoreCollages}
              fetchMoreReposts={handleFetchMoreReposts}
            />
          </>
        )}
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
