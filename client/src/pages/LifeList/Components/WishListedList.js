import { Text, View } from "react-native";
import ItemCard from "../Cards/ItemCard";
import { headerStyles, layoutStyles } from "../../../styles";

export default function WishListedList() {
  return (
    <View style={{ marginTop: 20 }}>
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
