import { View } from "react-native";
import { layoutStyles } from "../../../styles";
import CollageNavigator from "../Navigators/CollageNavigator";
import CollagePanel from "../PanelComponents/CollagePanel";

export default function Collage() {
  return (
    <View style={layoutStyles.wrapper}>
      <CollageNavigator />
      <CollagePanel />
    </View>
  );
}
