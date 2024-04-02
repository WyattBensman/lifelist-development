import { StyleSheet, Text, View } from "react-native";

export default function MainFeed() {
  return (
    <View style={styles.container}>
      <Text>Main Feed</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
