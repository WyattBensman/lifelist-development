import { Text, View } from "react-native";
import OngoingExperienceCard from "../Cards/OngoingExperienceCard";
import UpcomingExperienceCard from "../Cards/UpcomingExperienceCard";
import { headerStyles, layoutStyles } from "../../../styles";

export default function ExperiencesContainer({ editMode }) {
  return (
    <View style={layoutStyles.wrapper}>
      <Text style={headerStyles.headerMedium}>Ongoing Experiences</Text>
      <OngoingExperienceCard editMode={editMode} />
      <OngoingExperienceCard editMode={editMode} />
      <Text style={[headerStyles.headerMedium, layoutStyles.marginTopMd]}>
        Upcoming Experiences
      </Text>
      <UpcomingExperienceCard editMode={editMode} />
    </View>
  );
}
