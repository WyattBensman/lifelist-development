import React from "react";
import { View, FlatList } from "react-native";
import { layoutStyles } from "../../../../styles";
import ListItemCard from "../../Cards/ListItemCard";

const sortByTitle = (a, b) =>
  a.experience.title.localeCompare(b.experience.title);

export default function CategoryExperiencesList({
  lifeList,
  category,
  viewType,
  editMode,
  searchQuery,
  onDelete,
  userId,
}) {
  const filteredList = lifeList.experiences
    .filter(
      (exp) => exp.experience.category === category && exp.list === viewType
    )
    .filter((exp) =>
      exp.experience.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort(sortByTitle);

  const renderExperience = ({ item }) => (
    <ListItemCard
      experience={item}
      hasAssociatedShots={item.hasAssociatedShots}
      editMode={editMode}
      onDelete={onDelete}
      userId={userId}
    />
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
