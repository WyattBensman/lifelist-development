import { Image, StyleSheet, View } from "react-native";
import StackHeader from "../../../components/StackHeader";
import BackArrowIcon from "../../../icons/Universal/BackArrowIcon";
import ExploreTabs from "../Components/ExploreTabs";
import { useState } from "react";
import DropdownModal from "../Popups/DropdownModal";
import OptionsIcon from "../Icons/OptionsIcon";
import { layoutStyles } from "../../../styles";

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
    <View style={layoutStyles.container}>
      <StackHeader
        title={"Jackson Hole, Wyoming"}
        arrow={<BackArrowIcon navigation={navigation} />}
        button1={<OptionsIcon onPress={handleMoreIconPress} />}
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
