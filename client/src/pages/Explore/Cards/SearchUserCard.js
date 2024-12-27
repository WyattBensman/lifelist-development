import { Text, View, StyleSheet, Pressable } from "react-native";
import { Image } from "expo-image";
import { useNavigation } from "@react-navigation/native";

export default function SearchUserCard({ user, cacheVisitedProfile }) {
  const profilePictureUrl = user.profilePicture;
  const navigation = useNavigation();

  const handleProfilePress = () => {
    cacheVisitedProfile(user); // Cache the visited profile
    navigation.navigate("ProfileStack", {
      screen: "Profile",
      params: { userId: user._id },
    });
  };

  return (
    <View style={styles.listItemContainer}>
      <View style={styles.contentContainer}>
        <Image
          source={{ uri: profilePictureUrl }}
          onPress={handleProfilePress}
          style={styles.imageMd}
        />
        <Pressable style={styles.textContainer} onPress={handleProfilePress}>
          <Text style={styles.primaryText}>{user.fullName}</Text>
          <Text style={[styles.secondaryText, { marginTop: 2 }]}>
            @{user.username}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  listItemContainer: {
    padding: 8,
    marginTop: 8,
    backgroundColor: "#1C1C1C",
    borderRadius: 8,
  },
  contentContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  imageMd: {
    height: 48,
    width: 48,
    borderRadius: 4,
    backgroundColor: "#252525",
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
  },
  primaryText: {
    fontWeight: "600",
    color: "#fff",
  },
  secondaryText: {
    fontSize: 12,
    color: "#696969",
    marginTop: 1.5,
  },
  actionButtonContainer: {
    borderRadius: 8,
    alignSelf: "center",
  },
});
