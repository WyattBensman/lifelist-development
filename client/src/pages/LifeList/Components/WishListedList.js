import { Text, View } from "react-native";
import { headerStyles, layoutStyles } from "../../../styles";
import ExperienceCard from "../Cards/ExperienceCard";

export default function WishListedList() {
  return (
    <View style={layoutStyles.marginTopMd}>
      <Text style={headerStyles.headerMedium}>Wish Listed</Text>
      <View style={layoutStyles.flexRow}>
        <ExperienceCard />
        <ExperienceCard />
        <ExperienceCard />
      </View>
    </View>
  );
}
