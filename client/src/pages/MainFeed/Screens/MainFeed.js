import { StyleSheet, Text, View } from "react-native";
import Header from "../Components/Header";
import LifeListLogo from "../../../icons/MainFeed/LifeListLogo";

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
