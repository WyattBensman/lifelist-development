import { ScrollView, Text, View } from "react-native";
import { headerStyles, layoutStyles } from "../../../styles";
import EntryCard from "../Cards/EntryCard";
import ExperienceCard from "../Cards/ExperienceCard";

export default function Summary() {
  return (
    <View style={layoutStyles.container}>
      <ScrollView style={layoutStyles.contentContainer}>
        <Text style={headerStyles.headerMedium}>Entries</Text>
        <EntryCard />
        <View style={layoutStyles.marginTopLg}>
          <Text style={headerStyles.headerMedium}>
            Activities & Attractions
          </Text>
          <View style={layoutStyles.flexRow}>
            <ExperienceCard />
          </View>
        </View>
        <View style={layoutStyles.marginTopLg}>
          <Text style={headerStyles.headerMedium}>
            Concerts, Events & Festivals
          </Text>
          <View style={layoutStyles.flexRow}>
            <ExperienceCard />
          </View>
        </View>
        <View style={layoutStyles.marginTopMd}>
          <Text style={headerStyles.headerMedium}>
            Activities & Attractions
          </Text>
          <View style={layoutStyles.flexRow}>
            <ExperienceCard />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
