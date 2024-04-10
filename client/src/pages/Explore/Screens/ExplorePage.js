import { Image, StyleSheet, View } from "react-native";
import StackHeader from "../../../components/StackHeader";
import BackArrowIcon from "../../../icons/Universal/BackArrowIcon";
import ExploreTabs from "../Components/ExploreTabs";
import { useState } from "react";
import { globalStyling } from "../../../styles/GlobalStyling";
import MoreIcon from "../Icons/MoreIcon";
import DropdownModal from "../Popups/DropdownModal";

export default function ExplorePage({ navigation }) {
  const [activeTab, setActiveTab] = useState("Trending");
  const [modalVisible, setModalVisible] = useState(false);

  const handleMoreIconPress = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <View style={globalStyling.container}>
      <StackHeader
        title={"Jackson Hole, Wyoming"}
        arrow={<BackArrowIcon navigation={navigation} />}
        button1={<MoreIcon onPress={handleMoreIconPress} />}
      />
      <DropdownModal isVisible={modalVisible} onClose={closeModal} />
      <Image
        source={require("../../../../public/images/jackson-hole-01.png")}
        style={styles.image}
        resizeMode="cover"
      />
      <ExploreTabs onTabChange={setActiveTab} />
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    height: 120,
    width: "100%",
  },
});
