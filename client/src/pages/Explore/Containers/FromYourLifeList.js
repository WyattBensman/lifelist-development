import { Text, View } from "react-native";
import ExperienceCard from "../Cards/ExperienceCard";
import { headerStyles, layoutStyles } from "../../../styles";

export default function FromYourListList() {
  return (
    <View>
      <Text style={headerStyles.headerMedium}>From your LifeList</Text>
      <View style={layoutStyles.flexRow}>
        <ExperienceCard />
        <ExperienceCard />
        <ExperienceCard />
        <ExperienceCard />
      </View>
    </View>
  );
}
