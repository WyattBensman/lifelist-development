import { StyleSheet, View } from "react-native";
import { Image } from "expo-image";
import { useState } from "react";
import { layoutStyles } from "../../../styles";
import BackArrowIcon from "../../../icons/Universal/BackArrowIcon";
import OptionsIcon from "../Icons/OptionsIcon";
import HeaderStack from "../../../components/Headers/HeaderStack";
import ExploreNavigator from "../Navigators/ExploreNavigator";
import ActionsModal from "../Popups/ActionsModal";

export default function ExplorePage({ navigation }) {
  const [actionsPopupVisible, setActionsPopupVisible] = useState(false);

  const toggleActionsPopup = () => {
    setActionsPopupVisible(!actionsPopupVisible);
  };

  return (
    <View style={layoutStyles.container}>
      <HeaderStack
        title={"Jackson Hole, Wyoming"}
        arrow={<BackArrowIcon navigation={navigation} />}
        button1={<OptionsIcon onPress={toggleActionsPopup} />}
      />
      <Image
        source={require("../../../../public/images/jackson-hole-01.png")}
        style={styles.image}
        resizeMode="cover"
      />
      <ExploreNavigator />
      <ActionsModal
        modalVisible={actionsPopupVisible}
        setModalVisible={setActionsPopupVisible}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    height: 120,
    width: "100%",
  },
});
