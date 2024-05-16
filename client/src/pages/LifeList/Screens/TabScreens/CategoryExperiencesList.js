import React from "react";
import { Text, View, FlatList } from "react-native";
import { headerStyles, layoutStyles } from "../../../../styles";
import ListItemCard from "../../Cards/ListItemCard";

export default function CategoryExperiencesList({
  lifeList,
  category,
  viewType,
  editMode,
}) {
  const filteredList = lifeList.experiences.filter(
    (exp) => exp.experience.category === category && exp.list === viewType
  );

  const renderExperience = ({ item }) => (
    <ListItemCard experience={item.experience} editMode={editMode} />
  );

  return (
    <View style={[layoutStyles.wrapper, layoutStyles.paddingTopSm]}>
      <FlatList
        data={filteredList}
        renderItem={renderExperience}
        keyExtractor={(item) => item._id}
        style={layoutStyles.paddingLeftXxs}
      />
    </View>
  );
}
