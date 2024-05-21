import React, { useMemo } from "react";
import { Text, View, FlatList } from "react-native";
import { headerStyles, layoutStyles } from "../../../../styles";
import ExperienceCard from "../../Cards/ExperienceCard";

const sortByTitle = (a, b) =>
  a.experience.title.localeCompare(b.experience.title);

export default function CategoryExperiences({ lifeList, category }) {
  const filteredList = useMemo(
    () =>
      lifeList.experiences.filter(
        (exp) => exp.experience.category === category
      ),
    [lifeList.experiences, category]
  );

  const experiencedList = useMemo(
    () =>
      filteredList
        .filter((exp) => exp.list === "EXPERIENCED")
        .sort(sortByTitle),
    [filteredList]
  );

  const wishListedList = useMemo(
    () =>
      filteredList.filter((exp) => exp.list === "WISHLISTED").sort(sortByTitle),
    [filteredList]
  );

  const renderExperience = ({ item }) => (
    <ExperienceCard experience={item.experience} />
  );

  return (
    <View style={layoutStyles.wrapper}>
      <Text
        style={[
          headerStyles.headerMedium,
          layoutStyles.marginTopSm,
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
