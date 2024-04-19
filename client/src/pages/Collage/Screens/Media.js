import { StyleSheet, View } from "react-native";
import { layoutStyles } from "../../../styles";
import CollagePanel from "../PanelComponents/CollagePanel";

export default function Media() {
  return <View style={layoutStyles.container}></View>;
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
