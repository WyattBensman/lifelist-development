import React, { useMemo } from "react";
import { Text, View, FlatList, StyleSheet, Dimensions } from "react-native";
import { headerStyles, layoutStyles } from "../../../../styles";
import ExperienceCard from "../../Cards/ExperienceCard";

const { width: screenWidth } = Dimensions.get("window");
const cardWidth = screenWidth * 0.44;
const imageHeight = cardWidth * 1.33;
const cardHeight = imageHeight + 44;

const sortByTitle = (a, b) =>
  a.experience.title.localeCompare(b.experience.title);

export default function AllExperiences({ lifeList, navigation }) {
  const experiencedList = useMemo(
    () =>
      lifeList.experiences
        .filter((exp) => exp.list === "EXPERIENCED")
        .sort(sortByTitle),
    [lifeList.experiences]
  );

  const wishListedList = useMemo(
    () =>
      lifeList.experiences
        .filter((exp) => exp.list === "WISHLISTED")
        .sort(sortByTitle),
    [lifeList.experiences]
  );

  const renderExperience = ({ item }) => (
    <ExperienceCard
      experience={item.experience}
      lifeListExperienceId={item._id}
      associatedShots={item.associatedShots}
      navigation={navigation}
    />
  );

  const renderPlaceholder = () => (
    <View
      style={[styles.placeholderCard, { width: cardWidth, height: cardHeight }]}
    />
  );

  return (
    <View style={layoutStyles.wrapper}>
      <Text style={[headerStyles.headerMedium, layoutStyles.paddingLeftXxs]}>
        Experienced
      </Text>
      <FlatList
        data={experiencedList.length > 0 ? experiencedList : [{}]}
        renderItem={
          experiencedList.length > 0 ? renderExperience : renderPlaceholder
        }
        keyExtractor={(item, index) => item._id || index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={layoutStyles.paddingLeftXxs}
      />
      <Text style={[headerStyles.headerMedium, layoutStyles.paddingLeftXxs]}>
        Wish Listed
      </Text>
      <FlatList
        data={wishListedList.length > 0 ? wishListedList : [{}]}
        renderItem={
          wishListedList.length > 0 ? renderExperience : renderPlaceholder
        }
        keyExtractor={(item, index) => item._id || index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={layoutStyles.paddingLeftXxs}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  placeholderCard: {
    marginRight: 6,
    backgroundColor: "transparent",
  },
});
