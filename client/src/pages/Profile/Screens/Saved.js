import { Dimensions, View } from "react-native";
import { layoutStyles } from "../../../styles";
import StackHeader from "../../../components/StackHeader";
import BackArrowIcon from "../../../icons/Universal/BackArrowIcon";
import { useNavigation } from "@react-navigation/native";
import CollageCard from "../Cards/CollageCard";

const screenWidth = Dimensions.get("window").width;
const totalMarginPerImage = 1;
const imageWidth = (screenWidth - totalMarginPerImage * 3 * 4) / 3;

export default function Saved() {
  const navigation = useNavigation();

  return (
    <View styles={layoutStyles.container}>
      <StackHeader
        title={"Saved"}
        arrow={<BackArrowIcon navigation={navigation} />}
      />
      <View style={layoutStyles.containerTab}>
        <View style={layoutStyles.flexRowWrap}>
          <CollageCard width={imageWidth} />
          <CollageCard width={imageWidth} />
          <CollageCard width={imageWidth} />
          <CollageCard width={imageWidth} />
        </View>
      </View>
    </View>
  );
}
