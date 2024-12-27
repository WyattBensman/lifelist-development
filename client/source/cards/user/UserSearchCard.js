import { Text, View, Pressable } from "react-native";
import { Image } from "expo-image";
import { useNavigation } from "@react-navigation/native";
import cardStyles from "../../styles/components/cardStyles";

export default function UserSearchCard({ user, cacheVisitedProfile }) {
  const profilePictureUrl = user.profilePicture;
  const navigation = useNavigation();

  const handleProfilePress = () => {
    cacheVisitedProfile(user);
    navigation.navigate("ProfileStack", {
      screen: "Profile",
      params: { userId: user._id },
    });
  };

  return (
    <View style={cardStyles.listItemContainer}>
      <View style={cardStyles.contentContainer}>
        <Image source={{ uri: profilePictureUrl }} style={cardStyles.imageMd} />
        <Pressable
          style={cardStyles.textContainer}
          onPress={handleProfilePress}
        >
          <Text style={cardStyles.primaryText}>{user.fullName}</Text>
          <Text style={cardStyles.secondaryText}>@{user.username}</Text>
        </Pressable>
      </View>
    </View>
  );
}
