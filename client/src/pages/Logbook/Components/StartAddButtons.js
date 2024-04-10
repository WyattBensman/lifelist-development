import { StyleSheet, View } from "react-native";
import SolidButton from "../../../components/SolidButton";

export default function StartAddButtons({ onAddPress }) {
  return (
    <View style={styles.buttonContainer}>
      <View style={styles.buttonSpacer}>
        <SolidButton
          text="Start New Experience"
          backgroundColor={"#6AB952"}
          textColor={"#ffffff"}
        />
      </View>
      <SolidButton
        text="Add Upcoming Experience"
        backgroundColor={"#5FC4ED"}
        textColor={"#ffffff"}
        onPress={onAddPress}
      />
    </View>
  );
}
<SolidButton
  backgroundColor={"#DB302D"}
  text={"Delete Experiences"}
  textColor={"#FFFFFF"}
/>;

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: 20,
    marginBottom: 30,
  },
  buttonSpacer: {
    marginBottom: 10,
  },
});

{
  /* <>
  <View style={styles.buttonSpacer}>
    <GreenButton text="Start New Experience" />
  </View>
  <BlueButton text="Add Upcoming Experience" onPress={onAddPress} />
</>;
 */
}
