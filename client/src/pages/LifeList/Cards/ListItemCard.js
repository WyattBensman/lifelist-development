import { Image, StyleSheet, Text, View } from "react-native";
import { cardStyling } from "../../../styles/CardStyling";
import { globalStyling } from "../../../styles/GlobalStyling";
import DeleteIcon from "../Icons/DeleteIcon";

export default function ListItemCard({ editMode }) {
  return (
    <View style={cardStyling.container}>
      <View style={styles.flex}>
        <Image
          source={require("../../../../public/images/wyattbensman.png")}
          style={cardStyling.image}
        />
        <View style={[globalStyling.flex, { flex: 1 }]}>
          <Text
            style={[cardStyling.username, cardStyling.descriptionContainer]}
          >
            Jackson Hole, Wyoming
          </Text>
          {editMode && (
            <View style={[globalStyling.flex, { marginRight: 15 }]}>
              <View style={styles.wishListedContainer}>
                <Text style={styles.wishListedText}>Wish Listed</Text>
              </View>
              <DeleteIcon />
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flexDirection: "row",
    alignItems: "center",
  },
  experiencedContainer: {
    borderWidth: 1,
    borderColor: "#5FAF46",
    borderRadius: 5,
    marginRight: 10,
  },
  experiencedText: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    textAlign: "center",
    fontWeight: "500",
    fontSize: 12,
    color: "#5FAF46",
  },
  wishListedContainer: {
    borderWidth: 1,
    borderColor: "#5FC4ED",
    borderRadius: 5,
    marginRight: 10,
  },
  wishListedText: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    textAlign: "center",
    fontWeight: "500",
    fontSize: 12,
    color: "#5FC4ED",
  },
});
