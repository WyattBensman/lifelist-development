import { Dimensions, StyleSheet, View, Pressable } from "react-native";
import { Image } from "expo-image";

const { width } = Dimensions.get("window");
const spacing = 1.5;
const shotWidth = (width - spacing * 2) / 3; // Adjusted to account for the spacing
const shotHeight = (shotWidth * 3) / 2;

export default function ViewExperienceCard({
  shot,
  associatedShots,
  navigation,
  index,
  fromAlbum,
}) {
  console.log("Shot", shot);

  return (
    <Pressable
      onPress={() =>
        navigation.navigate("ViewExperienceShot", {
          shot,
          associatedShots,
        })
      }
      style={[
        styles.container,
        {
          marginRight: (index + 1) % 3 === 0 ? 0 : spacing, // Remove marginRight for the last item in each row
        },
      ]}
    >
      <View style={styles.shotContainer}>
        <Image source={{ uri: shot.imageThumbnail }} style={styles.shotImage} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: shotWidth,
    height: shotHeight,
    marginBottom: spacing,
  },
  shotContainer: {
    width: "100%",
    height: "100%",
    position: "relative",
  },
  shotImage: {
    width: "100%",
    height: "100%",
  },
});
