import { View, Text, StyleSheet } from "react-native";
import LoadingIcon from "./loadingIcon";
import { layoutStyles } from "../../styles";

function LoadingScreen() {
  return (
    <View style={[layoutStyles.wrapper, styles.container]}>
      {/* Centered Loading Icon */}
      <LoadingIcon />
      {/* Optional Loading Text */}
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  );
}

// Define additional styles if needed
const styles = StyleSheet.create({
  container: {
    justifyContent: "center", // Center vertically
    alignItems: "center", // Center horizontally
  },
  loadingText: {
    marginTop: 24,
    color: "#252525",
  },
});

export default LoadingScreen;
