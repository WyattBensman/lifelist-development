import React, { useCallback, useEffect, useRef, useState } from "react";
import { Animated, Text, View, FlatList, StyleSheet } from "react-native";
import { iconStyles, layoutStyles } from "../../../styles";
import ProfileOverview from "../Components/ProfileOverview";
import CustomProfileNavigator from "../Navigators/CustomProfileNavigator";
import AdminOptionsPopup from "../Popups/AdminOptionsPopup";
import DefaultOptionsPopup from "../Popups/DefaultOptionsPopup";
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { useAuth } from "../../../contexts/AuthContext";
import { useQuery } from "@apollo/client";
import {
  GET_USER_PROFILE,
  GET_FOLLOWING,
} from "../../../utils/queries/userQueries";
import HeaderStack from "../../../components/Headers/HeaderStack";
import Icon from "../../../components/Icons/Icon";

export default function Profile() {
  const navigation = useNavigation();
  const route = useRoute();
  const { currentUser } = useAuth();
  const [optionsPopupVisible, setOptionsPopupVisible] = useState(false);
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const userId = route.params?.userId;

  const { data, loading, error, refetch } = useQuery(GET_USER_PROFILE, {
    variables: { userId },
  });

  // Fetch current user's following list
  const { data: followingData, refetch: refetchFollowing } = useQuery(
    GET_FOLLOWING,
    {
      variables: { userId: currentUser._id },
    }
  );

  useFocusEffect(
    useCallback(() => {
      refetch(); // Refetch the profile data
      refetchFollowing(); // Refetch the following list to update the follow status
    }, [refetch, refetchFollowing])
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

  if (loading || !followingData) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  const profile = data.getUserProfileById;
  const isAdminView = profile._id === currentUser._id;

  // Determine if the current user is following this profile
  const isFollowing = followingData.getFollowing.some(
    (followedUser) => followedUser._id === profile._id
  );

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
              isAdminView={isAdminView}
              isAdminScreen={false}
              isFollowing={isFollowing}
            />
            <CustomProfileNavigator
              userId={profile._id}
              isAdmin={isAdminView}
              isAdminScreen={false}
              navigation={navigation}
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
