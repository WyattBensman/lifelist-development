import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import { globalStyling } from "../../../styles/GlobalStyling";
import { useTheme } from "../../../utils/ThemeContext";

// Get the screen's width
const screenWidth = Dimensions.get("window").width;
// Assuming you want 1 unit margin on each side of an image, thus 2 units total for each image
const totalMarginPerImage = 1;
// Calculate the available width for 3 images minus the margins
const imageWidth = (screenWidth - totalMarginPerImage * 3 * 4) / 3;

export default function Trending() {
  const theme = useTheme();

  return (
    <View
      style={[
        globalStyling.container,
        { backgroundColor: theme.colors.background, marginTop: 1 },
      ]}
    >
      <View style={styles.imageRow}>
        <Image
          source={require("../../../../public/images/wyattbensman.png")}
          style={[styles.image, { width: imageWidth }]}
        />
        <Image
          source={require("../../../../public/images/wyattbensman.png")}
          style={[styles.image, { width: imageWidth }]}
        />
        <Image
          source={require("../../../../public/images/wyattbensman.png")}
          style={[styles.image, { width: imageWidth }]}
        />
        <Image
          source={require("../../../../public/images/wyattbensman.png")}
          style={[styles.image, { width: imageWidth }]}
        />
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
  image: {
    aspectRatio: 1,
    margin: 1,
  },
});
