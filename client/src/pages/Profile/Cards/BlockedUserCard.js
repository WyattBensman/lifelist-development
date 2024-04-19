import { useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { cardStyles, layoutStyles } from "../../../styles";
import ButtonSmall from "../../../components/Buttons/ButtonSmall";
import UnblockUserModal from "../Popups/UnblockUserModal";

export default function BlockedUserCard() {
  const [modalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const unblockUser = () => {
    console.log("User has been unblocked!");
    setModalVisible(false);
  };

  return (
    <View style={layoutStyles.wrapper}>
      <View style={cardStyles.userCardContainer}>
        <View style={layoutStyles.flexRowSpace}>
          <Image
            source={require("../../../../public/images/wyattbensman.png")}
            style={cardStyles.imageMd}
          />
          <View>
            <Text style={cardStyles.primaryText}>Wyatt Bensman</Text>
            <Text style={[cardStyles.secondaryText, , { marginTop: 2 }]}>
              @wyattbensman
            </Text>
          </View>
        </View>
        <Pressable style={layoutStyles.marginRightMd}>
          <ButtonSmall
            text={"Blocked"}
            backgroundColor={"#ececec"}
            onPress={toggleModal}
          />
        </Pressable>
      </View>
      <UnblockUserModal
        modalVisible={modalVisible}
        onClose={toggleModal}
        onUnblock={unblockUser}
      />
    </View>
  );
}
