import { Text, View, Pressable } from "react-native";
import { Image } from "expo-image";
import cardStyles from "../../styles/components/cardStyles";

export default function RecommendedProfileCard({ user, onPress }) {
  return (
    <Pressable style={cardStyles.recommendedCardContainer} onPress={onPress}>
      <Image source={{ uri: user.profilePicture }} style={cardStyles.imageMd} />
      <View style={cardStyles.textContainer}>
        <Text style={cardStyles.primaryText}>{user.fullName}</Text>
        <Text style={cardStyles.secondaryText}>@{user.username}</Text>
      </View>
    </Pressable>
  );
}
