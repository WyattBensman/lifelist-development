import { Dimensions, View } from "react-native";
import { layoutStyles } from "../../../styles";
import { useNavigation } from "@react-navigation/native";
import BackArrowIcon from "../../../icons/Universal/BackArrowIcon";
import HeaderStack from "../../../components/Headers/HeaderStack";
import CollageCard from "../Cards/CollageCard";

const screenWidth = Dimensions.get("window").width;
const totalMarginPerImage = 1;
const imageWidth = (screenWidth - totalMarginPerImage * 3 * 4) / 3;

export default function Archived() {
  const navigation = useNavigation();

  return (
    <View styles={layoutStyles.wrapper}>
      <HeaderStack
        title={"Archived"}
        arrow={<BackArrowIcon navigation={navigation} />}
      />
      <View style={{ marginTop: 1 }}>
        <View style={layoutStyles.flexRowWrap}>
          <CollageCard width={imageWidth} />
        </View>
      </View>
    </View>
  );
}
