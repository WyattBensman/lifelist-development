import { Text, View } from "react-native";
import { headerStyles, layoutStyles } from "../../../styles";

export default function Entries() {
  return (
    <View style={layoutStyles.container}>
      <View style={layoutStyles.contentContainer}>
        <Text style={[headerStyles.headerMedium, { marginTop: 16 }]}>
          Tell us what happened!
        </Text>
        <Text>Tell us what happened!</Text>
      </View>
    </View>
  );
}
