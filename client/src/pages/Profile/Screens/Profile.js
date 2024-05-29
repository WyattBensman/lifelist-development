import React, { useState } from "react";
import { Text, View } from "react-native";
import { layoutStyles } from "../../../styles";
import OptionsIcon from "../Icons/OptionsIcon";
import ProfileOverview from "../Components/ProfileOverview";
import ProfileNavigator from "../Navigators/ProfileNavigator";
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
  const [optionsPopupVisible, setOptionsPopupVisible] = useState(false);

  const { currentUser } = useAuth(); // Getting the current user context
  const userId = route.params?.userId; // Getting the userId from the route parameters

  const { data, loading, error } = useQuery(GET_USER_PROFILE, {
    variables: { userId }, // Passing userId as a variable to the query
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
      <ProfileNavigator userId={profile._id} isAdmin={false} />

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
