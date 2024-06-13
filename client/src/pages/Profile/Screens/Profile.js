import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { headerStyles, layoutStyles } from "../../../styles";
import HeaderMain from "../../../components/Headers/HeaderMain";
import OptionsIcon from "../Icons/OptionsIcon";
import ProfileOverview from "../Components/ProfileOverview";
import CustomProfileNavigator from "../Navigators/CustomProfileNavigator";
import AdminOptionsPopup from "../Popups/AdminOptionsPopup";
import DefaultOptionsPopup from "../Popups/DefaultOptionsPopup";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useAuth } from "../../../contexts/AuthContext";
import { useQuery } from "@apollo/client";
import { GET_USER_PROFILE } from "../../../utils/queries/userQueries";
import HeaderStack from "../../../components/Headers/HeaderStack";
import BackArrowIcon from "../../../icons/Universal/BackArrowIcon";

export default function Profile() {
  const navigation = useNavigation();
  const route = useRoute();
  const { currentUser } = useAuth();
  const [optionsPopupVisible, setOptionsPopupVisible] = useState(false);

  const userId = route.params?.userId;

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
      <HeaderStack
        arrow={<BackArrowIcon navigation={navigation} />}
        title={profile.fullName}
        button1={<OptionsIcon onPress={toggleOptionsPopup} />}
      />
      <ProfileOverview
        profile={profile}
        isAdminView={isAdminView}
        isAdminScreen={false}
      />
      <CustomProfileNavigator
        userId={profile._id}
        isAdmin={isAdminView}
        isAdminScreen={false}
        navigation={navigation}
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
        />
      )}
    </View>
  );
}
