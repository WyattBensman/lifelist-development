import { View } from "react-native";
import { layoutStyles } from "../../../styles";
import { useNavigation, useRoute } from "@react-navigation/native";
import HeaderStack from "../../../components/Headers/HeaderStack";
import BackArrowIcon from "../../../icons/Universal/BackArrowIcon";
import Collage from "./Collage";

export default function ViewCollage() {
  const navigation = useNavigation();
  const route = useRoute();
  const { collageId } = route.params;

  return (
    <View style={layoutStyles.wrapper}>
      <HeaderStack arrow={<BackArrowIcon navigation={navigation} />} />
      <Collage collageId={collageId} />
    </View>
  );
}
