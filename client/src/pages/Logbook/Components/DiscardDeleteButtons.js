import { StyleSheet, View } from "react-native";
import RedButton from "../../../components/Buttons/RedButton";
import SolidButton from "../../../components/SolidButton";
import OutlinedButton from "../../../components/OutlinedButton";

export default function DiscardDeleteButtons({ toggleEditMode }) {
  return (
    <View style={styles.buttonContainer}>
      <View style={styles.buttonSpacer}>
        <SolidButton
          backgroundColor={"#DB302D"}
          text={"Delete Experiences"}
          textColor={"#FFFFFF"}
        />
      </View>
      <OutlinedButton
        borderColor={"#d4d4d4"}
        text={"Discard"}
        textColor={"#000000"}
        onPress={toggleEditMode}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: 20,
    marginBottom: 30,
  },
  buttonSpacer: {
    marginBottom: 10,
  },
});
