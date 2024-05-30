import { Text, View, StyleSheet, Pressable, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { layoutStyles } from "../../styles";
import SymbolButtonAction from "../../icons/SymbolButtonAction";
import TaggedUsersIcon from "../../icons/TaggedUsersIcon";
import Icon from "../../icons/Icon";
import { iconStyles } from "../../styles/iconStyles";

export default function Collage() {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate("ProfileStack", {
      screen: "Profile",
      params: { userId: "663a3133e0ffbeff092b81db" },
    });
  };

  return (
    <View style={layoutStyles.wrapper}>
      <View style={styles.imageContainer}>
        <Image
          style={styles.image}
          source={{
            uri: "http://localhost:3001/uploads/abby-bar-post.png",
          }}
        />
        <View style={styles.topContainer}>
          <View style={styles.topLeftContainer}>
            <Image
              style={styles.profilePicture}
              source={{
                uri: "http://localhost:3001/uploads/abby-barr-profile-picture.png",
              }}
            />
            <View style={styles.userInfo}>
              <Text style={styles.fullName}>Abby Barr</Text>
              <Text style={styles.location}>Kauai, Hawaii</Text>
            </View>
          </View>
          <Icon
            name="ellipsis"
            style={iconStyles.collageEllipsis}
            tintColor={"#ffffff"}
          />
        </View>
        <View style={styles.actionContainer}>
          <Icon name="heart" style={iconStyles.heart} tintColor={"#ffffff"} />
          <Icon
            name="repeat"
            style={iconStyles.repeat}
            spacer={16}
            tintColor={"#ffffff"}
          />
          <Icon
            name="bookmark"
            style={iconStyles.bookmark}
            spacer={16}
            tintColor={"#ffffff"}
          />
          <Icon
            name="tag"
            style={iconStyles.tag}
            spacer={16}
            tintColor={"#ffffff"}
          />
        </View>
      </View>
      <View style={styles.bottomContainer}>
        <Text style={styles.caption}>
          <Text style={styles.username}>abbybar </Text>
          caption caption caption caption caption caption caption caption
          caption caption caption caption caption caption caption
        </Text>
        <View style={styles.bottomTextContainer}>
          <Text style={styles.postDate}>May 21st, 2024</Text>
          <Text style={styles.viewComments}>Add Comment (17)</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    position: "relative",
  },
  image: {
    width: "100%", // Full width of the parent
    aspectRatio: 2 / 3, // 2:3 aspect ratio
    backgroundColor: "#d4d4d4", // Grey background color as a fallback
  },
  topContainer: {
    position: "absolute",
    top: 16,
    left: 16,
    right: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  topLeftContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  profilePicture: {
    height: 36,
    width: 36,
    borderRadius: 4,
    borderColor: "#ffffff",
    borderWidth: 1.5,
    marginRight: 6,
  },
  fullName: {
    fontWeight: "600",
    color: "#fff",
  },
  username: {
    fontWeight: "600",
  },
  location: {
    fontSize: 12,
    color: "#fff",
  },
  actionContainer: {
    position: "absolute",
    bottom: 12,
    alignSelf: "center",
    flexDirection: "row",
    backgroundColor: "rgba(38, 40, 40, 0.4)",
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  iconSpacer: {
    marginLeft: 8,
  },
  bottomContainer: {
    marginTop: 6,
    marginHorizontal: 16,
  },
  bottomTextContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
  },
  postDate: {
    fontSize: 12,
    color: "#d4d4d4",
  },
  viewComments: {
    color: "#d4d4d4",
    fontSize: 12,
  },
});
