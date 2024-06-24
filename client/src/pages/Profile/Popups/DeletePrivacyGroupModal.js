import {
  Modal,
  Text,
  View,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { BlurView } from "expo-blur";
import SolidButton from "../../../components/SolidButton";
import CloseButton from "../../../icons/Universal/CloseButton";
import { modalStyles as styles } from "../../../styles/ModalStyling";
import OutlinedButton from "../../../components/OutlinedButton";

export default function DeletePrivacyGroupModal({
  modalVisible,
  setModalVisible,
  onConfirm,
}) {
  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <BlurView
          style={styles.absolute}
          blurType="dark"
          blurAmount={10}
          reducedTransparencyFallbackColor="black"
        >
          <View style={styles.centeredView}>
            <KeyboardAvoidingView
              style={styles.fullWidth}
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
            >
              <View style={styles.modalView}>
                <Pressable
                  style={[styles.buttonClose]}
                  onPress={() => setModalVisible(false)}
                >
                  <CloseButton />
                </Pressable>
                <Text style={[styles.modalHeader, { textAlign: "center" }]}>
                  Are you sure you want to delete this privacy group?
                </Text>
                <View style={styles.actionButtons}>
                  <View style={{ flex: 1, marginRight: 4 }}>
                    <OutlinedButton
                      borderColor={"red"}
                      textColor={"red"}
                      text={"Delete Group"}
                      onPress={onConfirm}
                    />
                  </View>
                  <View style={{ flex: 1, marginLeft: 4 }}>
                    <SolidButton
                      backgroundColor={"#f4f4f4"}
                      text={"Discard"}
                      textColor={"#000000"}
                      onPress={() => setModalVisible(false)}
                    />
                  </View>
                </View>
              </View>
            </KeyboardAvoidingView>
          </View>
        </BlurView>
      </Modal>
    </View>
  );
}
