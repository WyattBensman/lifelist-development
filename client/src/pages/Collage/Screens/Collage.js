import React, { useState, useEffect, useCallback } from "react";
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
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Icon from "../../../icons/Icon";
import { iconStyles } from "../../../styles";
import { GET_COLLAGE_BY_ID } from "../../../utils/queries";
import {
  LIKE_COLLAGE,
  UNLIKE_COLLAGE,
  REPOST_COLLAGE,
  UNREPOST_COLLAGE,
  SAVE_COLLAGE,
  UNSAVE_COLLAGE,
} from "../../../utils/mutations";
import { useQuery, useMutation } from "@apollo/client";
import { BASE_URL } from "../../../utils/config";
import Comments from "../Popups/Comments";
import Participants from "../Popups/Participants";

const { width } = Dimensions.get("window");

export default function Collage({ collageId }) {
  const navigation = useNavigation();
  const { loading, error, data, refetch } = useQuery(GET_COLLAGE_BY_ID, {
    variables: { collageId },
  });

  const [showParticipants, setShowParticipants] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [isLiked, setIsLiked] = useState(false);
  const [isReposted, setIsReposted] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (data) {
      setIsLiked(data.getCollageById.isLikedByCurrentUser);
      setIsReposted(data.getCollageById.isRepostedByCurrentUser);
      setIsSaved(data.getCollageById.isSavedByCurrentUser);
    }
  }, [data]);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const [likeCollage] = useMutation(LIKE_COLLAGE, {
    onCompleted: () => setIsLiked(true),
  });
  const [unlikeCollage] = useMutation(UNLIKE_COLLAGE, {
    onCompleted: () => setIsLiked(false),
  });
  const [repostCollage] = useMutation(REPOST_COLLAGE, {
    onCompleted: () => setIsReposted(true),
  });
  const [unrepostCollage] = useMutation(UNREPOST_COLLAGE, {
    onCompleted: () => setIsReposted(false),
  });
  const [saveCollage] = useMutation(SAVE_COLLAGE, {
    onCompleted: () => setIsSaved(true),
  });
  const [unsaveCollage] = useMutation(UNSAVE_COLLAGE, {
    onCompleted: () => setIsSaved(false),
  });

  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
  if (error) return <Text>Error: {error.message}</Text>;

  const {
    collage: { caption, images, author, createdAt },
  } = data.getCollageById;

  const handleProfilePress = () => {
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

  const handleLikePress = async () => {
    if (isLiked) {
      await unlikeCollage({ variables: { collageId } });
    } else {
      await likeCollage({ variables: { collageId } });
    }
  };

  const handleRepostPress = async () => {
    if (isReposted) {
      await unrepostCollage({ variables: { collageId } });
    } else {
      await repostCollage({ variables: { collageId } });
    }
  };

  const handleSavePress = async () => {
    if (isSaved) {
      await unsaveCollage({ variables: { collageId } });
    } else {
      await saveCollage({ variables: { collageId } });
    }
  };

  return (
    <View style={styles.wrapper}>
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
            <Pressable onPress={handleProfilePress}>
              <Image
                style={styles.profilePicture}
                source={{
                  uri: `${BASE_URL}${author.profilePicture}`,
                }}
              />
            </Pressable>
            <View style={styles.userInfo}>
              <Pressable onPress={handleProfilePress}>
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
          <Icon
            name={isLiked ? "heart.fill" : "heart"}
            style={iconStyles.heart}
            tintColor={isLiked ? "#FF0000" : "#ffffff"}
            onPress={handleLikePress}
          />
          <Icon
            name="bubble"
            style={iconStyles.comment}
            spacer={16}
            tintColor={"#ffffff"}
            onPress={() => setShowComments(true)}
          />
          <Icon
            name="arrow.2.squarepath"
            style={iconStyles.repost}
            spacer={16}
            tintColor={isReposted ? "#6AB952" : "#ffffff"}
            onPress={handleRepostPress}
          />
          <Icon
            name={isSaved ? "bookmark.fill" : "bookmark"}
            style={iconStyles.bookmark}
            spacer={16}
            tintColor="#ffffff"
            onPress={handleSavePress}
          />
        </View>
      </View>
      <View style={styles.bottomContainer}>
        <View style={styles.captionContainer}>
          <Pressable onPress={handleProfilePress}>
            <Image
              style={styles.smallProfilePicture}
              source={{
                uri: `${BASE_URL}${author.profilePicture}`,
              }}
            />
          </Pressable>
          <View style={styles.captionTextContainer}>
            <Text style={styles.caption}>
              <Text onPress={handleProfilePress} style={styles.username}>
                {author.username}{" "}
              </Text>
              {caption}
            </Text>
          </View>
        </View>
        <View style={styles.bottomTextContainer}>
          <View style={styles.button}>
            <Text
              style={[
                styles.buttonText,
                { fontWeight: "400", color: "#d4d4d4" },
              ]}
            >
              {new Date(createdAt).toLocaleDateString()}
            </Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Pressable onPress={() => setShowComments(true)}>
              <View style={styles.button}>
                <Text style={styles.buttonText}>Comments</Text>
              </View>
            </Pressable>
            <Pressable onPress={() => setShowParticipants(true)}>
              <View style={[styles.button, { marginLeft: 8 }]}>
                <Text style={styles.buttonText}>Participants</Text>
              </View>
            </Pressable>
          </View>
        </View>
      </View>
      <Comments
        visible={showComments}
        onRequestClose={() => setShowComments(false)}
        collageId={collageId}
      />
      <Participants
        visible={showParticipants}
        onRequestClose={() => setShowParticipants(false)}
        collageId={collageId}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
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
  smallProfilePicture: {
    height: 38,
    width: 38,
    borderRadius: 6,
    borderColor: "#ffffff",
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
    backgroundColor: "rgba(38, 40, 40, 0.25)",
    borderRadius: 32,
    paddingHorizontal: 12,
  },
  iconSpacer: {
    marginLeft: 8,
  },
  bottomContainer: {
    flex: 1,
    marginTop: 8,
    marginHorizontal: 12,
    justifyContent: "space-between",
  },
  captionContainer: {
    flexDirection: "row",
    alignItems: "flex-start", // Align items to the top
  },
  captionTextContainer: {
    flex: 1, // Allow caption text to take available space
    justifyContent: "flex-start", // Align caption text to the top
  },
  bottomTextContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  caption: {
    flexWrap: "wrap",
    alignItems: "flex-start",
  },
  button: {
    backgroundColor: "#ececec", // Light green background
    borderRadius: 20, // Rounded corners
    paddingVertical: 6,
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#000", // Green text
    fontSize: 12,
    fontWeight: "500",
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
