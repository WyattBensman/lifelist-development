import { Text, View } from "react-native";
import ItemCard from "../Cards/ItemCard";
import { headerStyles, layoutStyles } from "../../../styles";

export default function ExperiencedList() {
  return (
    <View style={layoutStyles.marginTopSm}>
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
