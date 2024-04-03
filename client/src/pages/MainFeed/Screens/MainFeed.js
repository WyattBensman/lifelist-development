import { StyleSheet, Text, View } from "react-native";
import Header from "../Components/Header";

export default function MainFeed() {
  return (
    <View style={styles.container}>
      <Header />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
