import { Text, View, Pressable, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { BASE_URL } from "../../../utils/config";

export default function SearchUserCard({ user, onPress }) {
  const profilePictureUrl = `${BASE_URL}${user.profilePicture}`;

  return (
    <View style={styles.listItemContainer}>
      <Pressable style={styles.contentContainer} onPress={onPress}>
        <Image source={{ uri: profilePictureUrl }} style={styles.imageMd} />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{user.fullName}</Text>
          <Text style={styles.secondaryText}>@{user.username}</Text>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  listItemContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
    margin: 8,
  },
  contentContainer: {
    flex: 1,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  imageMd: {
    height: 40,
    width: 40,
    borderRadius: 4,
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontWeight: "600",
    color: "#fff",
  },
  secondaryText: {
    fontSize: 12,
    color: "#696969",
    marginTop: 1.5,
  },
});
