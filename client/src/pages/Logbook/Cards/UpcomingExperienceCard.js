import { Pressable, Text, View } from "react-native";
import { useState } from "react";
import { cardStyles, layoutStyles } from "../../../styles";
import ForwardArrowIcon from "../../../icons/Universal/ForwardArrowIcon";
import UpcomingExperienceIcon from "../Icons/UpcomingExperienceIcon";
import CheckedBoxIcon from "../../../icons/Universal/CheckedBoxIcon";
import UncheckedBoxIcon from "../../../icons/Universal/UncheckedBoxIcon";

export default function UpcomingExperienceCard({ editMode }) {
  const [selected, setSelected] = useState(false);

  const handlePress = () => {
    if (editMode) {
      setSelected(!selected);
    } else {
      // Navigate to the appropriate screen
    }
  };

  return (
    <Pressable onPress={handlePress} style={cardStyles.logbookCardContainer}>
      <View style={layoutStyles.flexRowSpace}>
        <View style={layoutStyles.flexRowSpace}>
          <UpcomingExperienceIcon />
          <Text>Punta Cana Vacation</Text>
        </View>
        <View style={layoutStyles.flexRowSpace}>
          {!editMode ? (
            <>
              <Text style={cardStyles.secondaryText}>Start</Text>
              <ForwardArrowIcon />
            </>
          ) : selected ? (
            <CheckedBoxIcon />
          ) : (
            <UncheckedBoxIcon />
          )}
        </View>
      </View>
    </Pressable>
  );
}
