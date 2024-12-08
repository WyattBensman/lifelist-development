import React, { useEffect, useRef, useState } from "react";
import { Animated, Text, View, FlatList, StyleSheet } from "react-native";
import { iconStyles, layoutStyles } from "../../../styles";
import ProfileOverview from "../Components/ProfileOverview";
import CustomProfileNavigator from "../Navigators/CustomProfileNavigator";
import AdminOptionsPopup from "../Popups/AdminOptionsPopup";
import DefaultOptionsPopup from "../Popups/DefaultOptionsPopup";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useAuth } from "../../../contexts/AuthContext";
import { useProfileCache } from "../../../contexts/ProfileCacheContext";
import Icon from "../../../components/Icons/Icon";
import HeaderStack from "../../../components/Headers/HeaderStack";

export default function AdminProfile() {
  const navigation = useNavigation();
  const { currentUser } = useAuth();
  const {
    fetchProfile,
    profile,
    followerData,
    isProfileInitialized,
    refreshProfile,
  } = useProfileCache();
  const [optionsPopupVisible, setOptionsPopupVisible] = useState(false);
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const route = useRoute();

  const userId = route.params?.userId || currentUser;
  const isAdminView = userId === currentUser;

  useEffect(() => {
    // Fetch the profile if it hasn't been initialized or if the userId changes
    if (!isProfileInitialized || profile?._id !== userId) {
      fetchProfile(userId);
    }
  }, [fetchProfile, userId, isProfileInitialized, profile]);

  // Animate rotation for options icon
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

  if (!isProfileInitialized) {
    return <Text>Loading...</Text>;
  }

  if (!profile) {
    return <Text>Error: Profile not found.</Text>;
  }

  return (
    <View style={layoutStyles.wrapper}>
      {/* Header */}
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

      {/* Profile Content */}
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
              refreshProfile={refreshProfile}
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
