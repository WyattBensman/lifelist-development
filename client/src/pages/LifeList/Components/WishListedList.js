import { Text, View } from "react-native";
import ItemCard from "../Cards/ItemCard";
import { headerStyles, layoutStyles } from "../../../styles";

export default function WishListedList() {
  return (
    <View style={layoutStyles.marginTopMd}>
      <Text style={headerStyles.headerMedium}>Wish Listed</Text>
      <View style={layoutStyles.flexRow}>
        <ItemCard />
        <ItemCard />
        <ItemCard />
        <ItemCard />
      </View>
    </View>
  );
}
