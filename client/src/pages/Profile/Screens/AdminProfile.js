import React, { useState } from "react";
import { Text, View } from "react-native";
import { headerStyles, layoutStyles } from "../../../styles";
import HeaderMain from "../../../components/Headers/HeaderMain";
import OptionsIcon from "../Icons/OptionsIcon";
import ProfileOverview from "../Components/ProfileOverview";
import CustomProfileNavigator from "../Navigators/CustomProfileNavigator";
import AdminOptionsPopup from "../Popups/AdminOptionsPopup";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../../contexts/AuthContext";
import { useQuery } from "@apollo/client";
import { GET_USER_PROFILE } from "../../../utils/queries/userQueries";

export default function AdminProfile() {
  const navigation = useNavigation();
  const { currentUser } = useAuth();
  const [optionsPopupVisible, setOptionsPopupVisible] = useState(false);

  const { data, loading, error } = useQuery(GET_USER_PROFILE, {
    variables: { userId: currentUser._id },
  });

  const toggleOptionsPopup = () => {
    setOptionsPopupVisible(!optionsPopupVisible);
  };

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  const profile = data.getUserProfileById;
  const isAdminView = true;

  return (
    <View style={layoutStyles.container}>
      <HeaderMain
        titleComponent={
          <Text style={headerStyles.headerHeavy}>{profile.fullName}</Text>
        }
        icon1={<OptionsIcon onPress={toggleOptionsPopup} />}
      />
      <ProfileOverview
        profile={profile}
        isAdminView={isAdminView}
        isAdminScreen={true}
      />
      <CustomProfileNavigator
        userId={profile._id}
        isAdmin={true}
        isAdminScreen={true} // Pass isAdminScreen prop
        navigation={navigation}
      />

      <AdminOptionsPopup
        visible={optionsPopupVisible}
        onRequestClose={toggleOptionsPopup}
        navigation={navigation}
      />
    </View>
  );
}
