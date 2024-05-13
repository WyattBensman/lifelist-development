import { Text, View } from "react-native";
import { useState } from "react";
import { headerStyles, layoutStyles } from "../../../styles";
import { useNavigation } from "@react-navigation/native";
import OptionsIcon from "../Icons/OptionsIcon";
import ProfileOverview from "../Components/ProfileOverview";
import ProfileNavigator from "../Navigators/ProfileNavigator";
import DefaultOptionsPopup from "../Popups/DefaultOptionsPopup";
import AdminOptionsPopup from "../Popups/AdminOptionsPopup";
import HeaderMain from "../../../components/Headers/HeaderMain";

export default function Profile() {
  const navigation = useNavigation();
  const [optionsPopupVisible, setOptionsPopupVisible] = useState(false);
  const [flowpagePopupVisible, setFlowpagePopuVisible] = useState(false);

  const toggleOptionsPopup = () => {
    setOptionsPopupVisible(!optionsPopupVisible);
  };

  const toggleFlowpagePopup = () => {
    setFlowpagePopuVisible(!flowpagePopupVisible);
  };

  return (
    <View style={layoutStyles.container}>
      <HeaderMain
        titleComponent={
          <Text style={headerStyles.headerHeavy}>Wyatt Bensman</Text>
        }
        icon2={<OptionsIcon onPress={toggleOptionsPopup} />}
      />
      <ProfileOverview />
      <ProfileNavigator />

      <AdminOptionsPopup
        visible={optionsPopupVisible}
        onRequestClose={toggleOptionsPopup}
        navigation={navigation}
      />

      {/* <DefaultOptionsPopup
        visible={optionsPopupVisible}
        onRequestClose={toggleOptionsPopup}
        navigation={navigation}
      /> */}
    </View>
  );
}
