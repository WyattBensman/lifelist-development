import { ScrollView, View } from "react-native";
import { layoutStyles } from "../../../../styles";
import ListItemCard from "../../Cards/ListItemCard";

export default function Activities() {
  return (
    <ScrollView style={[layoutStyles.wrapper, layoutStyles.paddingTopXs]}>
      <ListItemCard />
      <ListItemCard />
      <ListItemCard />
      <ListItemCard />
    </ScrollView>
  );
}
