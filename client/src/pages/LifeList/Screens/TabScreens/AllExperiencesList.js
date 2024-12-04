import React from "react";
import { View, FlatList } from "react-native";
import { layoutStyles } from "../../../../styles";
import ListItemCard from "../../Cards/ListItemCard";

export default function AllExperiencesList({
  lifeList,
  viewType,
  editMode,
  searchQuery,
  onDelete,
  userId,
}) {
  const filteredList = lifeList.experiences
    .filter((exp) => exp.list === viewType) // Filter by list type
    .filter((exp) => {
      const title = exp.experience?.title || ""; // Ensure title is always a string
      return title.toLowerCase().includes(searchQuery?.toLowerCase() || "");
    })
    .sort((a, b) => {
      const titleA = a.experience?.title || ""; // Default to empty string if title is missing
      const titleB = b.experience?.title || "";
      return titleA.localeCompare(titleB);
    });

  const renderExperience = ({ item }) => (
    <ListItemCard
      lifeListExperienceId={item._id}
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
