import { Pressable, Text, View } from "react-native";
import { useState } from "react";
import { cardStyles, layoutStyles } from "../../../styles";
import ForwardArrowIcon from "../../../icons/Universal/ForwardArrowIcon";
import UncheckedBoxIcon from "../../../icons/Universal/UncheckedBoxIcon";
import CheckedBoxIcon from "../../../icons/Universal/CheckedBoxIcon";

export default function OngoingExperienceCard({ editMode }) {
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
        <Text>July Recap</Text>
        <View style={layoutStyles.flexRowSpace}>
          {!editMode ? (
            <>
              <Text style={cardStyles.secondaryText}>Edit</Text>
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
