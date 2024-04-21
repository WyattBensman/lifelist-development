import { Text, View } from "react-native";
import { headerStyles, layoutStyles } from "../../../styles";
import ButtonSolid from "../../../components/Buttons/ButtonSolid";
import StartEntryForm from "../Forms/StartEntryForm";
import EntryCard from "../../Collage/Cards/EntryCard";

export default function Entries() {
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
          text={"Start an Entry"}
          backgroundColor={"#ececec"}
          marginTop={16}
        />
        <View style={layoutStyles.marginTopSm}>
          <EntryCard />
          <EntryCard />
        </View>
        {/* <StartEntryForm /> */}
      </View>
    </View>
  );
}
