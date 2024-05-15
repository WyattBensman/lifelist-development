import { Text, View } from "react-native";
import { useState } from "react";
import { headerStyles, layoutStyles } from "../../../styles";
import HeaderMain from "../../../components/Headers/HeaderMain";
import OptionsIcon from "../Icons/OptionsIcon";
import ProfileOverview from "../Components/ProfileOverview";
import ProfileNavigator from "../Navigators/ProfileNavigator";
import AdminOptionsPopup from "../Popups/AdminOptionsPopup";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../../contexts/AuthContext";

export default function AdminProfile() {
  const navigation = useNavigation();
  const { currentUser } = useAuth();
  const [optionsPopupVisible, setOptionsPopupVisible] = useState(false);

  const toggleOptionsPopup = () => {
    setOptionsPopupVisible(!optionsPopupVisible);
  };

  return (
    <View style={layoutStyles.container}>
      <HeaderMain
        titleComponent={
          <Text style={headerStyles.headerHeavy}>{currentUser.fullName}</Text>
        }
        icon1={<OptionsIcon onPress={toggleOptionsPopup} />}
      />
      <ProfileOverview currentUser={currentUser} />
      <ProfileNavigator />

      <AdminOptionsPopup
        visible={optionsPopupVisible}
        onRequestClose={toggleOptionsPopup}
        navigation={navigation}
      />
    </View>
  );
}

/* import DefaultOptionsPopup from "../Popups/DefaultOptionsPopup";
 */
{
  /*  */
}

{
  /* <DefaultOptionsPopup
        visible={optionsPopupVisible}
        onRequestClose={toggleOptionsPopup}
        navigation={navigation}
      /> */
}
