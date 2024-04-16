import { View, Text } from "react-native";
import { layoutStyles } from "../../../styles";
import CollageNavigator from "../Navigators/CollageNavigator";

export default function Collage() {
  return (
    <View style={layoutStyles.container}>
      <CollageNavigator />
    </View>
  );
}
