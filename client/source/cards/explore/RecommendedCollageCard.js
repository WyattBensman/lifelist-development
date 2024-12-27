import { Text, View, Pressable } from "react-native";
import { Image } from "expo-image";
import { truncateText } from "../../utils/commonHelpers";
import cardStyles from "../../styles/components/cardStyles";

export default function RecommendedCollageCard({
  collage,
  navigation,
  collageWidth,
  collageHeight,
}) {
  const fullName = truncateText(collage.author.fullName, 20);
  const username = truncateText(collage.author.username, 20);

  /* const handlePress = () => {
    navigation.push("CollageDetails", { collageId: collage._id });
  }; */

  return (
    <Pressable onPress={handlePress} style={{ width: collageWidth }}>
      <View>
        <Image
          source={{ uri: collage.coverImage }}
          style={[
            cardStyles.imageRadius,
            { height: collageHeight, width: collageWidth },
          ]}
        />
        <View style={cardStyles.textSpacer}>
          <Text style={cardStyles.primaryText}>{fullName}</Text>
          <Text style={cardStyles.secondaryText}>@{username}</Text>
        </View>
      </View>
    </Pressable>
  );
}
