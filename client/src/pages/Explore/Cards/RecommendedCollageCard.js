import { StyleSheet, Text, View, Pressable } from "react-native";
import { Image } from "expo-image";
import { truncateText } from "../../../utils/utils";

export default function RecommendedCollageCard({
  collage,
  navigation,
  collageWidth,
  collageHeight,
}) {
  const fullName = truncateText(collage.author.fullName, 20);
  const username = truncateText(collage.author.username, 20);

  return (
    <Pressable>
      <View style={{ width: collageWidth }}>
        <Image
          source={{ uri: collage.coverImage }}
          style={[styles.image, { height: collageHeight, width: collageWidth }]}
        />
        <View style={styles.spacer}>
          <Text style={styles.title}>{fullName}</Text>
          <View style={styles.secondaryTextContainer}>
            <Text style={styles.secondaryText}>{username}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  image: {
    borderRadius: 4,
  },
  title: {
    fontWeight: "600",
    marginTop: 4,
    color: "#fff",
  },
  secondaryTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 1.5,
  },
  secondaryText: {
    fontSize: 12,
    color: "#696969",
  },
  spacer: {
    marginLeft: 8,
  },
});
