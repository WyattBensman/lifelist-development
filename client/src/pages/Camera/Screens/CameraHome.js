import { Text, View, StyleSheet } from "react-native";

export default function CameraHome() {
  return (
    <View style={styles.container}>
      <Text>CameraHome</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 75,
  },
});
