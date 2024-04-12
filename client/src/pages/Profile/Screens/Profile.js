import { Text, View } from "react-native";
import Header from "../../../components/Header";
import FlowPageIcon from "../Icons/FlowPageIcon";
import OptionsIcon from "../Icons/OptionsIcon";
import ProfileOverview from "../Components/ProfileOverview";
import ProfileNavigator from "../Components/ProfileNavigator";
import BottomPopup from "../Popups/BottomPopup";
import { useState } from "react";
import { headerStyles, layoutStyles } from "../../../styles";

export default function Profile() {
  const [popupVisible, setPopupVisible] = useState(false);

  const togglePopup = () => {
    setPopupVisible(!popupVisible);
  };

  return (
    <View style={layoutStyles.container}>
      <Header
        titleComponent={
          <Text style={headerStyles.headerHeavy}>Wyatt Bensman</Text>
        }
        icon1={<FlowPageIcon />}
        icon2={<OptionsIcon onPress={togglePopup} />}
      />
      <ProfileOverview />
      <ProfileNavigator />

      <BottomPopup visible={popupVisible} onRequestClose={togglePopup}>
        <Text>Options</Text>
      </BottomPopup>
    </View>
  );
}
