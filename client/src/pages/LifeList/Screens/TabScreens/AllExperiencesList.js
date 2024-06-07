import React from "react";
import { View, FlatList } from "react-native";
import { layoutStyles } from "../../../../styles";
import ListItemCard from "../../Cards/ListItemCard";

const sortByTitle = (a, b) =>
  a.experience.title.localeCompare(b.experience.title);

export default function AllExperiencesList({
  lifeList,
  viewType,
  editMode,
  searchQuery,
  onDelete,
}) {
  const filteredList = lifeList.experiences
    .filter((exp) => exp.list === viewType)
    .filter((exp) =>
      exp.experience.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort(sortByTitle);

  const renderExperience = ({ item }) => (
    <ListItemCard experience={item} editMode={editMode} onDelete={onDelete} />
  );

  return (
    <View style={layoutStyles.wrapper}>
      <FlatList
        data={filteredList}
        renderItem={renderExperience}
        keyExtractor={(item) => item._id}
      />
    </View>
  );
}
