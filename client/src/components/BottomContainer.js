import { StyleSheet, View } from "react-native";

export default function BottomContainer({ topButton, bottomButton }) {
  return (
    <View style={styles.bottomContainer}>
      <View style={styles.buttonContainer}>
        <View style={styles.spacer}>{topButton}</View>
        {bottomButton}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomContainer: {
    borderTopColor: "#D4D4D4",
    borderTopWidth: 1,
    justifyContent: "center",
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 25,
    zIndex: 1,
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 30,
  },
  spacer: {
    marginBottom: 10,
  },
});
