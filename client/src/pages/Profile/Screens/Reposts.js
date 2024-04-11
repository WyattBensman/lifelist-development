import { Dimensions, StyleSheet, View } from "react-native";
import CollageCard from "../Cards/CollageCard";
import { globalStyling } from "../../../styles/GlobalStyling";
import { useTheme } from "@react-navigation/native";

const screenWidth = Dimensions.get("window").width;
const totalMarginPerImage = 1;
const imageWidth = (screenWidth - totalMarginPerImage * 3 * 4) / 3;

export default function Reposts() {
  const theme = useTheme();

  return (
    <View
      style={[
        globalStyling.container,
        { backgroundColor: theme.colors.background, marginTop: 1 },
      ]}
    >
      <View style={styles.imageRow}>
        <CollageCard width={imageWidth} />
        <CollageCard width={imageWidth} />
        <CollageCard width={imageWidth} />
        <CollageCard width={imageWidth} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  imageRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginHorizontal: 2,
  },
});
