import React from "react";
import { FlatList, StyleSheet, Text } from "react-native";
import AddShotToExperienceCard from "../Cards/AddShotToExperienceCard";

export default function AllExperiencesList({
  lifeList,
  searchQuery,
  navigation,
  cardComponent: CardComponent = AddShotToExperienceCard,
}) {
  const filteredExperiences = lifeList.experiences.filter((experience) =>
    experience.experience.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <FlatList
      data={filteredExperiences}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => (
        <CardComponent experience={item} navigation={navigation} />
      )}
      ListEmptyComponent={<Text>No experiences found</Text>}
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
  },
});
