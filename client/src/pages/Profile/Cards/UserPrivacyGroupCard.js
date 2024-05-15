import { Image, Pressable, Text, View } from "react-native";
import { cardStyles, layoutStyles } from "../../../styles";
import { useState } from "react";
import CheckedBoxIcon from "../../../icons/Universal/CheckedBoxIcon";
import UncheckedBoxIcon from "../../../icons/Universal/UncheckedBoxIcon";

export default function UserPrivacyGroupCard({
  isEditMode,
  fullName,
  username,
  profilePicture,
}) {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckedToggle = () => {
    setIsChecked(!isChecked);
  };

  return (
    <View style={cardStyles.userCardContainer}>
      <View style={layoutStyles.flexRowSpace}>
        <Image source={{ uri: profilePicture }} style={cardStyles.imageMd} />
        <View>
          <Text style={cardStyles.primaryText}>{fullName}</Text>
          <Text style={[cardStyles.secondaryText, , { marginTop: 2 }]}>
            @{username}
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
