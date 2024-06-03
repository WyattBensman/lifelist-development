import React, { useMemo } from "react";
import { Text, View, FlatList } from "react-native";
import { headerStyles, layoutStyles } from "../../../../styles";
import ExperienceCard from "../../Cards/ExperienceCard";

const sortByTitle = (a, b) =>
  a.experience.title.localeCompare(b.experience.title);

export default function AllExperiences({ lifeList }) {
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
      associatedShots={item.associatedShots}
    />
  );

  return (
    <View style={layoutStyles.wrapper}>
      <Text
        style={[
          headerStyles.headerMedium,
          layoutStyles.marginTopXs,
          layoutStyles.paddingLeftXxs,
        ]}
      >
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
