import React from "react";
import { View, FlatList } from "react-native";
import { layoutStyles } from "../../../../styles";
import ListItemCard from "../../Cards/ListItemCard";
import EditExperienceCard from "../../Cards/EditExperienceCard";

const sortByTitle = (a, b) =>
  a.experience.title.localeCompare(b.experience.title);

export default function CategoryExperiencesList({
  lifeList,
  category,
  viewType,
  editMode,
  searchQuery,
  navigation,
}) {
  const filteredList = lifeList.experiences
    .filter(
      (exp) => exp.experience.category === category && exp.list === viewType
    )
    .filter((exp) =>
      exp.experience.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort(sortByTitle);

  const renderExperience = ({ item }) =>
    editMode ? (
      <EditExperienceCard experience={item} navigation={navigation} />
    ) : (
      <ListItemCard experience={item} />
    );

  return (
    <View style={layoutStyles.wrapper}>
      <View style={layoutStyles.contentContainer}>
        <FlatList
          data={filteredList}
          renderItem={renderExperience}
          keyExtractor={(item) => item._id}
        />
      </View>
    </View>
  );
}
