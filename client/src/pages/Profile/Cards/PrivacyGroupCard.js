import { Pressable, StyleSheet, Text, View } from "react-native";
import { cardStyles, layoutStyles } from "../../../styles";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import ForwardArrowIcon from "../../../icons/Universal/ForwardArrowIcon";
import OutlinedButton from "../../../components/OutlinedButton";
import SolidButton from "../../../components/SolidButton";
import DeletePrivacyGroupModal from "../Popups/DeletePrivacyGroupModal";

export default function PrivacyGroupCard({ isEditMode, privacyGroup }) {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);

  const toggleModal = () => setModalVisible(!modalVisible);

  return (
    <Pressable
      onPress={() => !isEditMode && navigation.navigate("PrivacyGroup")}
    >
      <View style={cardStyles.privacyGroupCard}>
        <View style={layoutStyles.flex}>
          <View>
            <Text style={{ fontWeight: "500" }}>{privacyGroup.groupName}</Text>
            <Text style={{ fontStyle: "italic", marginTop: 2 }}>
              {privacyGroup.users.length} Members
            </Text>
          </View>
          {!isEditMode && <ForwardArrowIcon />}
        </View>
        {isEditMode && (
          <View style={styles.buttonContainer}>
            <OutlinedButton
              style={styles.button}
              text={"Delete"}
              borderColor={"red"}
              textColor={"red"}
              width={"48%"}
              onPress={toggleModal}
            />
            <SolidButton
              style={[styles.button, styles.lastButton]}
              text={"Edit"}
              backgroundColor={"#6AB952"}
              textColor={"#ffffff"}
              width={"48%"}
            />
          </View>
        )}
      </View>
      <DeletePrivacyGroupModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    paddingHorizontal: 6,
  },
});

{
  /* <Pressable
onPress={() =>
  !isEditMode &&
  navigation.navigate("PrivacyGroup", {
    groupId: privacyGroup._id,
  })
}
> */
}
