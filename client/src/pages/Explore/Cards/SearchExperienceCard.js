import React from "react";
import {
  Image,
  Text,
  View,
  StyleSheet,
  Pressable,
  Dimensions,
} from "react-native";
import { BASE_URL } from "../../../utils/config";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");
const cardWidth = width * 0.85;

export default function SearchExperienceCard({ experience }) {
  const navigation = useNavigation();
  const imageUrl = `${BASE_URL}${experience.image}`;

  const handlePress = () => {
    navigation.navigate("ViewExperience", { experienceId: experience._id });
  };

  return (
    <Pressable onPress={handlePress}>
      <View style={[styles.cardContainer, { width: cardWidth }]}>
        <Image source={{ uri: imageUrl }} style={styles.image} />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{experience.title}</Text>
          <Text style={styles.secondaryText}>{experience.category}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    margin: 8,
    backgroundColor: "#1C1C1C",
    borderRadius: 8,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: cardWidth * 0.56, // 16:9 aspect ratio
  },
  textContainer: {
    padding: 12,
  },
  title: {
    fontWeight: "600",
    color: "#FFFFFF",
  },
  secondaryText: {
    fontSize: 12,
    color: "#d4d4d4",
    marginTop: 4,
  },
});
