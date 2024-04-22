import { Text, View } from "react-native";
import { headerStyles, layoutStyles } from "../../../styles";
import ButtonSolid from "../../../components/Buttons/ButtonSolid";
import ActivitiesAttractions from "../Components/ActivitiesAttractions";
import ConcertsFestivalsEvents from "../Components/ConcertsFestivalsEvents";

export default function Experiences() {
  return (
    <View style={layoutStyles.wrapper}>
      <View style={layoutStyles.contentContainer}>
        <Text style={[headerStyles.headerMedium, { marginBottom: 6 }]}>
          Tell us what happened!
        </Text>
        <Text>
          Include as many stories, or summaries you want regarding your
          experiences.
        </Text>
        <ButtonSolid
          text={"Add Experiences"}
          backgroundColor={"#ececec"}
          marginTop={16}
        />
        <ActivitiesAttractions />
        <ConcertsFestivalsEvents />
      </View>
    </View>
  );
}
