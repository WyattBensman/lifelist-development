import {
  Text,
  View,
  StyleSheet,
  Pressable,
  Image,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@apollo/client";
import { layoutStyles } from "../../../styles";
import Icon from "../../../icons/Icon";
import { iconStyles } from "../../../styles";
import { GET_COLLAGE_BY_ID } from "../../../utils/queries";

export default function Collage({ collageId }) {
  console.log(collageId);
  const navigation = useNavigation();
  const { loading, error, data } = useQuery(GET_COLLAGE_BY_ID, {
    variables: { collageId },
  });

  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
  if (error) return <Text>Error: {error.message}</Text>;

  const { caption, images, coverImage, author, createdAt } =
    data.getCollageById;

  const handlePress = () => {
    navigation.navigate("ProfileStack", {
      screen: "Profile",
      params: { userId: author._id },
    });
  };

  return (
    <View style={layoutStyles.wrapper}>
      <View style={styles.imageContainer}>
        <Image
          style={styles.image}
          source={{
            uri: coverImage,
          }}
        />
        <View style={styles.topContainer}>
          <View style={styles.topLeftContainer}>
            <Pressable onPress={handlePress}>
              <Image
                style={styles.profilePicture}
                source={{
                  uri: author.profilePicture,
                }}
              />
            </Pressable>
            <View style={styles.userInfo}>
              <Text style={styles.fullName}>{author.fullName}</Text>
              <Text style={styles.location}>Location unknown</Text>
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
            name="bubble"
            style={iconStyles.comment}
            spacer={16}
            tintColor={"#ffffff"}
          />
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
        </View>
      </View>
      <View style={styles.bottomContainer}>
        <Text style={styles.caption}>
          <Text style={styles.username}>{author.username} </Text>
          {caption}
        </Text>
        <View style={styles.bottomTextContainer}>
          <Text style={styles.postDate}>
            {new Date(createdAt).toLocaleDateString()}
          </Text>
          <Text style={styles.viewComments}>Tagged Users (7)</Text>
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
    width: "100%",
    aspectRatio: 2 / 3,
    backgroundColor: "#d4d4d4",
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
    flex: 1,
    marginTop: 8,
    marginHorizontal: 16,
    justifyContent: "space-between",
  },
  bottomTextContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  postDate: {
    fontSize: 12,
    color: "#d4d4d4",
  },
  viewComments: {
    fontSize: 12,
    color: "#d4d4d4",
  },
});
