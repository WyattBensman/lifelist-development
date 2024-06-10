// AllExperiences.js
import React, { useMemo } from "react";
import { Text, View, FlatList, StyleSheet } from "react-native";
import { headerStyles, layoutStyles } from "../../../../styles";
import ExperienceCard from "../../Cards/ExperienceCard";

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

  return (
    <View style={layoutStyles.wrapper}>
      <Text style={[headerStyles.headerMedium, layoutStyles.paddingLeftXxs]}>
        Experienced
      </Text>
      <FlatList
        data={experiencedList}
        renderItem={renderExperience}
        keyExtractor={(item) => item._id}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={layoutStyles.paddingLeftXxs}
      />
      <Text style={[headerStyles.headerMedium, layoutStyles.paddingLeftXxs]}>
        Wish Listed
      </Text>
      <FlatList
        data={wishListedList}
        renderItem={renderExperience}
        keyExtractor={(item) => item._id}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={layoutStyles.paddingLeftXxs}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  navigatorContainer: {
    flexDirection: "row",
    marginLeft: 6,
  },
  navigatorButton: {
    backgroundColor: "#ececec",
    alignSelf: "flex-start",
    marginTop: 12,
    marginRight: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  navigatorText: {
    fontWeight: "500",
  },
});
