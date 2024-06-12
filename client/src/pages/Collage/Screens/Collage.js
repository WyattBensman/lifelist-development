import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Pressable,
  Image,
  ActivityIndicator,
  FlatList,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { layoutStyles } from "../../../styles";
import Icon from "../../../icons/Icon";
import { iconStyles } from "../../../styles";
import { GET_COLLAGE_BY_ID } from "../../../utils/queries";
import { useQuery } from "@apollo/client";
import { BASE_URL } from "../../../utils/config";
import Comments from "../Popups/Comments";
import Participants from "../Popups/Participants";

const { width } = Dimensions.get("window");

export default function Collage({ collageId }) {
  const navigation = useNavigation();
  const { loading, error, data } = useQuery(GET_COLLAGE_BY_ID, {
    variables: { collageId },
  });

  const [showParticipants, setShowParticipants] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0);

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

  const renderItem = ({ item }) => (
    <Image
      style={styles.image}
      source={{
        uri: `${BASE_URL}${item}`,
      }}
    />
  );

  const handleScroll = (event) => {
    const index = Math.floor(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  return (
    <View style={layoutStyles.wrapper}>
      <View style={styles.imageContainer}>
        <FlatList
          data={images}
          renderItem={renderItem}
          horizontal
          pagingEnabled
          onScroll={handleScroll}
          keyExtractor={(item, index) => index.toString()}
          showsHorizontalScrollIndicator={false}
        />
        {images.length > 1 && (
          <View style={styles.indicatorContainer}>
            {images.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicator,
                  index === currentIndex ? styles.activeIndicator : null,
                ]}
              />
            ))}
          </View>
        )}
        <View style={styles.topContainer}>
          <View style={styles.topLeftContainer}>
            <Pressable onPress={handlePress}>
              <Image
                style={styles.profilePicture}
                source={{
                  uri: `${BASE_URL}${author.profilePicture}`,
                }}
              />
            </Pressable>
            <View style={styles.userInfo}>
              <Pressable onPress={handlePress}>
                <Text style={styles.fullName}>{author.fullName}</Text>
              </Pressable>
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
            onPress={() => setShowComments(true)}
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
          <Text onPress={handlePress} style={styles.username}>
            {author.username}{" "}
          </Text>
          {caption}
        </Text>
        <View style={styles.bottomTextContainer}>
          <Text style={styles.postDate}>
            {new Date(createdAt).toLocaleDateString()}
          </Text>
          <Pressable onPress={() => setShowParticipants(true)}>
            <Text style={styles.viewComments}>Tagged Users (7)</Text>
          </Pressable>
        </View>
      </View>
      <Comments
        visible={showComments}
        onRequestClose={() => setShowComments(false)}
      />
      <Participants
        visible={showParticipants}
        onRequestClose={() => setShowParticipants(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    position: "relative",
  },
  image: {
    width: width, // Use screen width for FlatList images
    height: width * (3 / 2), // Maintain aspect ratio of 2:3
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
  indicatorContainer: {
    position: "absolute",
    bottom: 5,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  indicator: {
    height: 2,
    width: 20,
    backgroundColor: "#ffffff",
    marginHorizontal: 2,
    borderRadius: 2,
    opacity: 0.5,
  },
  activeIndicator: {
    opacity: 1,
  },
});
