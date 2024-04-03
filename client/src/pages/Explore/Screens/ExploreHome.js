import { Text, View, StyleSheet } from "react-native";

export default function ExploreHome() {
  return (
    <View style={styles.container}>
      <Text>Explore Home</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 75,
  },
});
