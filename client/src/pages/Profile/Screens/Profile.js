import { Image, StyleSheet, Text, View } from "react-native";
import { globalStyling } from "../../../styles/GlobalStyling";
import Header from "../../../components/Header";
import FlowPageIcon from "../Icons/FlowPageIcon";
import OptionsIcon from "../Icons/OptionsIcon";
import ProfileOverview from "../Components/ProfileOverview";
import { useTheme } from "../../../utils/ThemeContext";
import ProfileNavigator from "../Components/ProfileNavigator";
import BottomPopup from "../Popups/BottomPopup";
import { useState } from "react";

export default function Profile() {
  const [popupVisible, setPopupVisible] = useState(false);
  const theme = useTheme();

  const togglePopup = () => {
    setPopupVisible(!popupVisible);
  };

  return (
    <View
      style={[
        globalStyling.container,
        { backgroundColor: theme.colors.background },
      ]}
    >
      <Header
        titleComponent={<Text style={styles.header}>Wyatt Bensman</Text>}
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

const styles = StyleSheet.create({
  header: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 10,
  },
});
