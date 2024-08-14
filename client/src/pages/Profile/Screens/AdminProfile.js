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

export default function AdminProfile() {
  const navigation = useNavigation();
  const { currentUser } = useAuth();
  const [optionsPopupVisible, setOptionsPopupVisible] = useState(false);
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const { data, loading, error, refetch } = useQuery(GET_USER_PROFILE, {
    variables: { userId: currentUser._id },
  });

  useFocusEffect(
    useCallback(() => {
      refetch();
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
