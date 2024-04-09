import { StyleSheet, View } from "react-native";
import RedButton from "../../../components/Buttons/RedButton";
import GreyOutlineButton from "../../../components/Buttons/GreyOutlineButton";

export default function DiscardDeleteButtons({ toggleEditMode }) {
  return (
    <View style={styles.buttonContainer}>
      <View style={styles.buttonSpacer}>
        <RedButton text="Delete Experiences" />
      </View>
      <GreyOutlineButton text="Discard Changes" onPress={toggleEditMode} />
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
