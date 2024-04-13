import { Text, View } from "react-native";
import Header from "../../../components/Header";
import FlowPageIcon from "../Icons/FlowPageIcon";
import OptionsIcon from "../Icons/OptionsIcon";
import ProfileOverview from "../Components/ProfileOverview";
import ProfileNavigator from "../Navigators/ProfileNavigator";
import { useState } from "react";
import { headerStyles, layoutStyles } from "../../../styles";
import DefaultOptionsPopup from "../Popups/DefaultOptionsPopup";
import AdminOptionsPopup from "../Popups/AdminOptionsPopup";
import FlowPagePopup from "../Popups/FlowPagePopup";
import { useNavigation } from "@react-navigation/native";

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
      <Header
        titleComponent={
          <Text style={headerStyles.headerHeavy}>Wyatt Bensman</Text>
        }
        icon1={<FlowPageIcon onPress={toggleFlowpagePopup} />}
        icon2={<OptionsIcon onPress={toggleOptionsPopup} />}
      />
      <ProfileOverview />
      <ProfileNavigator />

      <AdminOptionsPopup
        visible={optionsPopupVisible}
        onRequestClose={toggleOptionsPopup}
        navigation={navigation}
      />

      <FlowPagePopup
        visible={flowpagePopupVisible}
        onRequestClose={toggleFlowpagePopup}
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
