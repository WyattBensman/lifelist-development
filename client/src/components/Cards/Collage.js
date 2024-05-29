import { Text, View, StyleSheet, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { layoutStyles } from "../../styles";
import SymbolButton from "../../icons/SymbolButton";

export default function Collage() {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate("ProfileStack", {
      screen: "Profile",
      params: { userId: "663a3133e0ffbeff092b81db" },
    });
  };

  return (
    <View style={layoutStyles.wrapper}>
      {/* Grey Box with 2:3 Aspect Ratio */}
      <View style={styles.greyBox}></View>
      <View style={styles.bottomContainer}>
        <View style={styles.topContainer}>
          {/* MAKE THIS VIEW NAVIGATE TO THE USER'S PROFILE */}
          <Pressable onPress={handlePress}>
            <View>
              <Text style={styles.fullName}>Full Name</Text>
              <Text style={styles.postDate}>May 21st, 2024</Text>
            </View>
          </Pressable>
          {/* COLLAGE ACTIONS */}
          <View style={styles.actionContainer}>
            <SymbolButton name="heart" />
            <View style={styles.iconSpacer}>
              <SymbolButton name="bubble" />
            </View>
            <View style={styles.iconSpacer}>
              <SymbolButton name="repeat" />
            </View>
            <View style={styles.iconSpacer}>
              <SymbolButton name="bookmark" />
            </View>
          </View>
        </View>
        <Text style={styles.bio}>
          Hey you there what are you up to today? Hey Hey
        </Text>
        <Text style={styles.viewComments}>View Comments</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  greyBox: {
    width: "100%", // This makes the box take the full width of its parent
    aspectRatio: 2 / 3,
    backgroundColor: "#d4d4d4", // 2:3 aspect ratio // Grey background color
  },
  bottomContainer: {
    marginTop: 4,
    marginHorizontal: 16,
  },
  topContainer: {
    flexDirection: "row", // Set row direction
    justifyContent: "space-between", // Space between elements
    alignItems: "center", // Align items in the center vertically
  },
  profilePicture: {
    height: 25,
    width: 25,
    backgroundColor: "#d4d4d4",
  },
  fullName: {
    fontWeight: "600",
  },
  postDate: {
    fontSize: 12,
    color: "#d4d4d4",
  },
  actionContainer: {
    flexDirection: "row",
  },
  bio: {
    marginTop: 4,
  },
  viewComments: {
    marginTop: 4,
    color: "#d4d4d4",
  },
  iconSpacer: {
    marginLeft: 4,
  },
});
