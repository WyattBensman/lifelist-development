import React, { useState, useEffect } from "react";
import { Text, View } from "react-native";
import { headerStyles, layoutStyles } from "../../../styles";
import HeaderMain from "../../../components/Headers/HeaderMain";
import OptionsIcon from "../Icons/OptionsIcon";
import ProfileOverview from "../Components/ProfileOverview";
import ProfileNavigator from "../Navigators/ProfileNavigator";
import AdminOptionsPopup from "../Popups/AdminOptionsPopup";
import DefaultOptionsPopup from "../Popups/DefaultOptionsPopup";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useAuth } from "../../../contexts/AuthContext";
import { useQuery } from "@apollo/client";
import { GET_USER_PROFILE } from "../../../utils/queries/userQueries";

export default function Profile() {
  const navigation = useNavigation();
  const { currentUser } = useAuth();
  const route = useRoute();
  const { userId } = route.params || currentUser._id;
  const [optionsPopupVisible, setOptionsPopupVisible] = useState(false);

  const { data, loading, error } = useQuery(GET_USER_PROFILE, {
    variables: { userId },
  });

  const toggleOptionsPopup = () => {
    setOptionsPopupVisible(!optionsPopupVisible);
  };

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  const profile = data.getUserProfileById;
  const isAdminView = profile._id === currentUser._id;

  return (
    <View style={layoutStyles.container}>
      <HeaderMain
        titleComponent={
          <Text style={headerStyles.headerHeavy}>{profile.fullName}</Text>
        }
        icon1={<OptionsIcon onPress={toggleOptionsPopup} />}
      />
      <ProfileOverview profile={profile} isAdminView={isAdminView} />
      <ProfileNavigator />

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
