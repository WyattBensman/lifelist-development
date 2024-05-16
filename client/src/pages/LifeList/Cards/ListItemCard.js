import React, { useState } from "react";
import { Image, Text, View, Pressable } from "react-native";
import { cardStyles, layoutStyles } from "../../../styles";
import { truncateText } from "../../../utils/utils";
import UncheckedBoxIcon from "../../../icons/Universal/UncheckedBoxIcon";
import CheckedBoxIcon from "../../../icons/Universal/CheckedBoxIcon";

const baseURL = "http://localhost:3001";

export default function ListItemCard({ experience, editMode }) {
  const [isSelected, setIsSelected] = useState(false);
  const imageUrl = `${baseURL}${experience.image}`;
  const truncatedTitle = truncateText(experience.title, 30);

  const handlePress = () => {
    if (editMode) {
      setIsSelected(!isSelected);
    }
  };

  return (
    <Pressable
      onPress={editMode ? handlePress : null}
      style={cardStyles.userCardContainer}
    >
      <View style={layoutStyles.flexRowSpace}>
        <Image source={{ uri: imageUrl }} style={cardStyles.imageMd} />
        <Text>{truncatedTitle}</Text>
      </View>
      {editMode && (
        <View style={[layoutStyles.flexRowSpace, layoutStyles.marginRightMd]}>
          {isSelected ? <CheckedBoxIcon /> : <UncheckedBoxIcon />}
        </View>
      )}
    </Pressable>
  );
}
