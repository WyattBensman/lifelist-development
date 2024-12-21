import React, { useState, useEffect, useRef } from "react";
import { Text, View, Animated, FlatList } from "react-native";
import { headerStyles, iconStyles, layoutStyles } from "../../../styles";
import HeaderMain from "../../../components/Headers/HeaderMain";
import ProfileOverview from "../Components/ProfileOverview";
import CustomProfileNavigator from "../Navigators/CustomProfileNavigator";
import AdminOptionsPopup from "../Popups/AdminOptionsPopup";
import { useNavigation } from "@react-navigation/native";
import { useAdminProfile } from "../../../contexts/AdminProfileContext";
import Icon from "../../../components/Icons/Icon";
import { useAuth } from "../../../contexts/AuthContext";

export default function AdminProfile() {
  const navigation = useNavigation();
  const {
    adminProfile,
    collages,
    reposts,
    counts,
    hasActiveMoments,
    fetchMoreCollages,
    fetchMoreReposts,
    refreshAdminProfile,
  } = useAdminProfile();
  const { currentUser } = useAuth();

  const [optionsPopupVisible, setOptionsPopupVisible] = useState(false);
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    refreshAdminProfile(); // Ensure fresh data on component mount
  }, []);

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

  if (!adminProfile) {
    return <Text style={layoutStyles.loadingText}>Loading...</Text>;
  }

  return (
    <View style={layoutStyles.wrapper}>
      {/* Header */}
      <HeaderMain
        titleComponent={
          <Text style={headerStyles.headerHeavy}>{adminProfile?.fullName}</Text>
        }
        icon2={
          <Animated.View style={{ transform: [{ rotate: rotation }] }}>
            <Icon
              name="ellipsis"
              style={iconStyles.ellipsis}
              weight="bold"
              onPress={toggleOptionsPopup}
            />
          </Animated.View>
        }
        icon1={
          <Icon
            name="bell"
            style={iconStyles.ellipsis}
            weight="bold"
            onPress={() => navigation.navigate("Notifications")}
          />
        }
      />

      {/* Profile Content */}
      <FlatList
        data={[{ key: "Collages", component: CustomProfileNavigator }]}
        keyExtractor={(item) => item.key}
        renderItem={() => (
          <CustomProfileNavigator
            userId={currentUser}
            isAdmin
            isAdminScreen
            navigation={navigation}
            collages={collages}
            repostedCollages={reposts}
            fetchMoreCollages={fetchMoreCollages}
            fetchMoreReposts={fetchMoreReposts}
            hasActiveMoments={hasActiveMoments}
          />
        )}
        ListHeaderComponent={() => (
          <ProfileOverview
            profile={adminProfile}
            followerData={{
              followersCount: counts.followersCount,
              followingCount: counts.followingCount,
              collagesCount: counts.collagesCount,
            }}
            userId={currentUser}
            isAdminView
            isAdminScreen
          />
        )}
        style={layoutStyles.wrapper}
      />

      {/* Options Popup */}
      <AdminOptionsPopup
        visible={optionsPopupVisible}
        onRequestClose={toggleOptionsPopup}
        navigation={navigation}
      />
    </View>
  );
}
