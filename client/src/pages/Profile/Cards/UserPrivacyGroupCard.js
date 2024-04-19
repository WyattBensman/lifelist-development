import { Image, Text, View } from "react-native";
import { cardStyles, layoutStyles } from "../../../styles";
import { useState } from "react";
import CheckedBoxIcon from "../../../icons/Universal/CheckedBoxIcon";
import UncheckedBoxIcon from "../../../icons/Universal/UncheckedBoxIcon";

export default function UserPrivacyGroupCard({ isEditMode }) {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckedToggle = () => {
    setIsChecked(!isChecked);
  };

  return (
    <View style={cardStyles.userCardContainer}>
      <View style={layoutStyles.flexRowSpace}>
        <Image
          source={require("../../../../public/images/wyattbensman.png")}
          style={cardStyles.imageMd}
        />
        <View>
          <Text style={cardStyles.primaryText}>Wyatt Bensman</Text>
          <Text style={[cardStyles.secondaryText, , { marginTop: 2 }]}>
            @wyattbensman
          </Text>
        </View>
      </View>
      <View style={{ marginRight: 24 }}>
        {isEditMode &&
          (isChecked ? (
            <CheckedBoxIcon onPress={handleCheckedToggle} />
          ) : (
            <UncheckedBoxIcon onPress={handleCheckedToggle} />
          ))}
      </View>
    </View>
  );
}
