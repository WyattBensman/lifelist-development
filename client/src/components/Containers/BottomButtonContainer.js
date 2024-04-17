import { StyleSheet, View } from "react-native";
import { layoutStyles } from "../../styles";

export default function BottomButtonContainer({ topButton, bottomButton }) {
  return (
    <View style={styles.bottomContainer}>
      <View style={styles.buttonContainer}>
        <View style={layoutStyles.marginBtmSm}>{topButton}</View>
        {bottomButton}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomContainer: {
    borderTopWidth: 1,
    borderTopColor: "#D4D4D4",
    backgroundColor: "#ffffff",
    paddingHorizontal: 24,
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  buttonContainer: {
    marginTop: 16,
    marginBottom: 36,
  },
});
