import { Dimensions, View } from "react-native";
import CollageCard from "../Cards/CollageCard";
import { layoutStyles } from "../../../styles";

const screenWidth = Dimensions.get("window").width;
const totalMarginPerImage = 1;
const imageWidth = (screenWidth - totalMarginPerImage * 3 * 4) / 3;

export default function Reposts() {
  return (
    <View style={layoutStyles.containerTab}>
      <View style={layoutStyles.flexRowWrap}>
        <CollageCard width={imageWidth} />
        <CollageCard width={imageWidth} />
        <CollageCard width={imageWidth} />
        <CollageCard width={imageWidth} />
      </View>
    </View>
  );
}
