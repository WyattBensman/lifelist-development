import { Pressable, StyleSheet, Text, View } from "react-native";
import { layoutStyles } from "../../../styles";
import ForwardArrowIcon from "../../../icons/Universal/ForwardArrowIcon";
import { useNavigation } from "@react-navigation/native";
import OutlinedButton from "../../../components/OutlinedButton";
import SolidButton from "../../../components/SolidButton";
import { useState } from "react";
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
      <View style={[styles.cardContainer, layoutStyles.marginTopLg]}>
        <View style={layoutStyles.flex}>
          <View>
            <Text style={styles.title}>Cool Guys</Text>
            <Text style={styles.users}>
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
            {/* <SolidButton
              style={styles.button}
              text={"Edit"}
              backgroundColor={"#5FC4ED"}
              textColor={"#ffffff"}
              width={"32%"}
            /> */}
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
  cardContainer: {
    padding: 16,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: "#d4d4d4",
  },
  title: {
    fontWeight: "500",
  },
  users: {
    fontSize: 12,
    marginTop: 6,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    paddingHorizontal: 6,
  },
});
