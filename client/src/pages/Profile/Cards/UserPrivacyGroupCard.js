import { Image, StyleSheet, Text, View } from "react-native";
import { cardStyling } from "../../../styles/CardStyling";
import { layoutStyles } from "../../../styles";
import { useState } from "react";
import CheckedBoxIcon from "../../../icons/Universal/CheckedBoxIcon";
import UncheckedBoxIcon from "../../../icons/Universal/UncheckedBoxIcon";

export default function UserPrivacyGroupCard({ isEditMode }) {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckedToggle = () => {
    setIsChecked(!isChecked);
  };

  return (
    <View style={cardStyling.container}>
      <View style={styles.flex}>
        <Image
          source={require("../../../../public/images/wyattbensman.png")}
          style={cardStyling.image}
        />
        <View style={[layoutStyles.flex, { flex: 1 }]}>
          <Text
            style={[cardStyling.username, cardStyling.descriptionContainer]}
          >
            Wyatt Bensman
          </Text>
          <View style={{ marginRight: 24 }}>
            {isEditMode &&
              (isChecked ? (
                <CheckedBoxIcon onPress={handleCheckedToggle} />
              ) : (
                <UncheckedBoxIcon onPress={handleCheckedToggle} />
              ))}
          </View>
        </View>
      </View>
    </View>
  );
}

/* {
  !editMode ? (
    <>
      <Text style={styles.editText}>Edit</Text>
      <ForwardArrowIcon />
    </>
  ) : selected ? (
    <CheckedBoxIcon />
  ) : (
    <UncheckedBoxIcon />
  );
} */

const styles = StyleSheet.create({
  flex: {
    flexDirection: "row",
    alignItems: "center",
  },
  followContainer: {
    borderWidth: 1,
    borderColor: "#ececec",
    backgroundColor: "#ececec",
    borderRadius: 5,
    marginRight: 10,
    width: 75,
  },
  followText: {
    paddingVertical: 4,
    textAlign: "center",
    fontWeight: "500",
    fontSize: 12,
    color: "#262828",
  },
  followingContainer: {
    borderWidth: 1,
    borderColor: "#d4d4d4",
    borderRadius: 5,
    marginRight: 10,
    width: 75,
  },
  followingText: {
    paddingVertical: 4,
    textAlign: "center",
    fontWeight: "500",
    fontSize: 12,
    color: "#262828",
  },
});
