import React from "react";
import { Text, View, FlatList } from "react-native";
import { headerStyles, layoutStyles } from "../../../../styles";
import ExperienceCard from "../../Cards/ExperienceCard";

export default function CategoryExperiences({ lifeList, category }) {
  const filteredList = lifeList.experiences.filter(
    (exp) => exp.experience.category === category
  );

  const sortByTitle = (a, b) => {
    if (a.experience.title < b.experience.title) return -1;
    if (a.experience.title > b.experience.title) return 1;
    return 0;
  };

  const experiencedList = filteredList
    .filter((exp) => exp.list === "EXPERIENCED")
    .sort(sortByTitle);

  const wishListedList = filteredList
    .filter((exp) => exp.list === "WISHLISTED")
    .sort(sortByTitle);

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
