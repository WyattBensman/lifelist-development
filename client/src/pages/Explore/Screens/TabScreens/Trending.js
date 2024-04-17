import { Dimensions, View } from "react-native";
import { layoutStyles } from "../../../../styles";
import CollageCard from "../../../../components/Cards/CollageCard";

const screenWidth = Dimensions.get("window").width;
const totalMarginPerImage = 1;
const imageWidth = (screenWidth - totalMarginPerImage * 3 * 4) / 3;

export default function Trending() {
  return (
    <View style={layoutStyles.wrapper}>
      <View style={layoutStyles.flexRowWrap}>
        <CollageCard width={imageWidth} />
      </View>
    </View>
  );
}
