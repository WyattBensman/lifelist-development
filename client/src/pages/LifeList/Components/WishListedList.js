import React from "react";
import { Text, View, FlatList } from "react-native";
import { headerStyles, layoutStyles } from "../../../styles";
import ExperienceCard from "../Cards/ExperienceCard";

export default function WishListedList({ experiences }) {
  const renderExperienceCard = ({ item }) => (
    <ExperienceCard experience={item.experience} />
  );

  return (
    <View style={layoutStyles.marginTopMd}>
      <Text style={headerStyles.headerMedium}>Wish Listed</Text>
      <FlatList
        data={experiences}
        renderItem={renderExperienceCard}
        keyExtractor={(item) => item._id}
        horizontal
      />
    </View>
  );
}
