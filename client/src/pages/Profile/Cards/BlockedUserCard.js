import { useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { cardStyles, layoutStyles } from "../../../styles";
import ButtonSmall from "../../../components/Buttons/ButtonSmall";
import UnblockUserModal from "../Popups/UnblockUserModal";

export default function BlockedUserCard({
  userId,
  fullName,
  username,
  profilePicture,
  onUnblock,
}) {
  const [modalVisible, setModalVisible] = useState(false);

  const toggleModal = () => setModalVisible(!modalVisible);

  return (
    <View style={layoutStyles.wrapper}>
      <View style={cardStyles.userCardContainer}>
        <View style={layoutStyles.flexRowSpace}>
          <Image source={{ uri: profilePicture }} style={cardStyles.imageMd} />
          <View>
            <Text style={cardStyles.primaryText}>{fullName}</Text>
            <Text style={[cardStyles.secondaryText, , { marginTop: 2 }]}>
              @{username}
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
        onUnblock={() => onUnblock(userId)}
      />
    </View>
  );
}
