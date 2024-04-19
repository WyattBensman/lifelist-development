import { Pressable, StyleSheet, Text, View } from "react-native";
import { cardStyles, layoutStyles } from "../../../styles";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import ForwardArrowIcon from "../../../icons/Universal/ForwardArrowIcon";
import OutlinedButton from "../../../components/OutlinedButton";
import SolidButton from "../../../components/SolidButton";
import DeletePrivacyGroupModal from "../Popups/DeletePrivacyGroupModal";

export default function PrivacyGroupCard({ isEditMode }) {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const handlePress = () => {
    if (!isEditMode) {
      navigation.navigate("PrivacyGroup");
    }
  };

  return (
    <Pressable onPress={handlePress}>
      <View style={cardStyles.privacyGroupCard}>
        <View style={layoutStyles.flex}>
          <View>
            <Text style={{ fontWeight: "500" }}>Cool Guys</Text>
            <Text style={{ fontSize: 12, marginTop: 6 }}>
              Wyatt Bensman, Eli Kuck, Carter Elliott
            </Text>
            <Text style={[styles.users, { fontStyle: "italic" }]}>
              12 Members
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
