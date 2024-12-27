import React from "react";
import { Dimensions, View, Pressable } from "react-native";
import { Image } from "expo-image";
import { cardStyles } from "../../styles/components/cardStyles";

const { width } = Dimensions.get("window");
const spacing = 2;
const shotWidth = (width - spacing * 2) / 3; // Adjusted to account for the spacing
const shotHeight = (shotWidth * 3) / 2;

export default function CameraShotNavigateCard({
  shot,
  navigation,
  index,
  fromAlbum,
}) {
  return (
    <Pressable
      onPress={() =>
        navigation.navigate("ViewShot", {
          shotId: shot._id,
          fromAlbum, // Pass the 'fromAlbum' parameter
        })
      }
      style={[
        cardStyles.cameraShotContainer,
        {
          marginRight: (index + 1) % 3 === 0 ? 0 : spacing, // Remove marginRight for the last item in each row
        },
      ]}
    >
      <View style={cardStyles.shotWrapper}>
        <Image
          source={{ uri: shot.imageThumbnail }}
          style={cardStyles.shotImage}
        />
      </View>
    </Pressable>
  );
}
