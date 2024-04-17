import { Text, View } from "react-native";
import { layoutStyles } from "../../../../styles";
import ExperiencedList from "../../Components/ExperiencedList";
import WishListedList from "../../Components/WishListedList";

export default function Activities() {
  return (
    <View style={layoutStyles.wrapper}>
      <View style={layoutStyles.marginLeftXs}>
        <ExperiencedList />
        <WishListedList />
      </View>
    </View>
  );
}
