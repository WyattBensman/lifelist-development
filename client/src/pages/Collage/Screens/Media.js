import { StyleSheet, View } from "react-native";
import { layoutStyles } from "../../../styles";
import CollagePanel from "../Components/CollagePanel";

export default function Media() {
  return (
    <View style={layoutStyles.container}>
      <View style={styles.image1}></View>
      <View style={styles.image1}></View>
      <CollagePanel />
    </View>
  );
}

const styles = StyleSheet.create({
  image1: {
    height: 278,
    width: 278,
    marginTop: 4,
    marginLeft: 4,
    marginBottom: 2,
    marginRight: 2,
    backgroundColor: "#000000",
  },
});
