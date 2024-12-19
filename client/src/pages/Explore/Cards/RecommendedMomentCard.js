import React, { useState } from "react";
import { Image, StyleSheet, Text, View, Pressable } from "react-native";
import { truncateText } from "../../../utils/utils";

export default function RecommendedMomentCard({ moment, navigation }) {
  const [imageThumbnail, setImageThumbnail] = useState(
    moment.cameraShot.imageThumbnail
  );

  const fullName = truncateText(moment.author, 19);
  const username = truncateText(collage.author, 19);

  return (
    <Pressable>
      <View style={[styles.cardContainer]}>
        <Image source={{ uri: imageThumbnail }} style={styles.image} />
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
  cardContainer: {
    marginRight: 6,
  },
  image: {
    height: 240,
    width: 160,
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
