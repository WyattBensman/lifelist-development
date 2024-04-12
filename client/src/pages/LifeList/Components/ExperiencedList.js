import { Text, View } from "react-native";
import ItemCard from "../Cards/ItemCard";
import { headerStyles, layoutStyles } from "../../../styles";

export default function ExpereincedList() {
  return (
    <View>
      <Text style={headerStyles.headerMedium}>Experienced</Text>
      <View style={layoutStyles.flexRow}>
        <ItemCard />
        <ItemCard />
        <ItemCard />
        <ItemCard />
      </View>
    </View>
  );
}
