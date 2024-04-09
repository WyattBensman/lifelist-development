import GreenButton from "../../../components/Buttons/GreenButton";
import BlueButton from "../../../components/Buttons/BlueButton";
import { StyleSheet, View } from "react-native";

export default function StartAddButtons({ onAddPress }) {
  return (
    <>
      <View style={styles.buttonSpacer}>
        <GreenButton text="Start New Experience" />
      </View>
      <BlueButton text="Add Upcoming Experience" onPress={onAddPress} />
    </>
  );
}

const styles = StyleSheet.create({
  buttonSpacer: {
    marginTop: 15,
    marginBottom: 10,
  },
});
