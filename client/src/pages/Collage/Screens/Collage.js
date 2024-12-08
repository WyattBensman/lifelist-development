import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Text,
  View,
  StyleSheet,
  Pressable,
  Image,
  ActivityIndicator,
  FlatList,
  Dimensions,
  Animated,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { iconStyles, layoutStyles } from "../../../styles";
import { GET_COLLAGE_BY_ID } from "../../../utils/queries";
import {
  LIKE_COLLAGE,
  UNLIKE_COLLAGE,
  REPOST_COLLAGE,
  UNREPOST_COLLAGE,
  SAVE_COLLAGE,
  UNSAVE_COLLAGE,
  ARCHIVE_COLLAGE,
  UNARCHIVE_COLLAGE,
} from "../../../utils/mutations";
import { useQuery, useMutation } from "@apollo/client";
import { BASE_URL } from "../../../utils/config";
import Comments from "../Popups/Comments";
import Participants from "../Popups/Participants";
import IconCollage from "../../../components/Icons/IconCollage";
import { useAuth } from "../../../contexts/AuthContext";
import AuthorOptions from "../Popups/AuthorOptions";
import DefaultOptions from "../Popups/DefaultOptions";

const { width } = Dimensions.get("window");

export default function Collage({
  collageId,
  isMainFeed,
  isViewCollageScreen,
}) {
  const { currentUser } = useAuth();
  const navigation = useNavigation();
  const { loading, error, data, refetch } = useQuery(GET_COLLAGE_BY_ID, {
    variables: { collageId },
  });

  const [showParticipants, setShowParticipants] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [isLiked, setIsLiked] = useState(false);
  const [isReposted, setIsReposted] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isArchived, setIsArchived] = useState(false);
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (data) {
      setIsLiked(data.getCollageById.isLikedByCurrentUser);
      setIsReposted(data.getCollageById.isRepostedByCurrentUser);
      setIsSaved(data.getCollageById.isSavedByCurrentUser);
      setIsArchived(data.getCollageById.collage.archived);
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

  const [archiveCollage] = useMutation(ARCHIVE_COLLAGE, {
    onCompleted: () => setIsArchived(true),
  });
  const [unarchiveCollage] = useMutation(UNARCHIVE_COLLAGE, {
    onCompleted: () => setIsArchived(false),
  });

  useEffect(() => {
    Animated.timing(rotateAnim, {
      toValue: showOptions ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [showOptions]);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "90deg"],
  });

  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
  if (error) return <Text>Error: {error.message}</Text>;

  const {
    collage: { caption, images, author, createdAt },
    hasParticipants,
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
        uri: item,
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

  const handleArchivePress = async () => {
    if (isArchived) {
      await unarchiveCollage({ variables: { collageId } });
    } else {
      await archiveCollage({ variables: { collageId } });
    }
  };

  const handleOptionsPress = () => {
    setShowOptions(!showOptions); // Toggle the options popup
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
            <Pressable onPress={handleProfilePress}>
              <Image
                style={styles.profilePicture}
                source={{
                  uri: author.profilePicture,
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
        </View>
        <View style={styles.actionContainer}>
          <Pressable onPress={handleLikePress}>
            <IconCollage
              name={isLiked ? "heart.fill" : "heart"}
              style={iconStyles.like}
              weight={"medium"}
              tintColor={isLiked ? "#ff0000" : "#ffffff"}
              backgroundColor={"rgba(38, 40, 40, 0.25)"}
              onPress={handleLikePress}
            />
          </Pressable>
          <Pressable onPress={handleRepostPress} style={styles.iconSpacer}>
            <IconCollage
              name="arrow.2.squarepath"
              style={iconStyles.repost}
              weight={"medium"}
              tintColor={isReposted ? "#6AB952" : "#ffffff"}
              backgroundColor={"rgba(38, 40, 40, 0.25)"}
              onPress={handleRepostPress}
            />
          </Pressable>
          <Pressable
            onPress={() => setShowComments(true)}
            style={styles.iconSpacer}
          >
            <IconCollage
              name="text.bubble"
              style={iconStyles.comment}
              weight={"medium"}
              tintColor={"#ffffff"}
              backgroundColor={"rgba(38, 40, 40, 0.25)"}
              onPress={() => setShowComments(true)}
            />
          </Pressable>
          <Pressable onPress={handleOptionsPress} style={styles.iconSpacer}>
            <Animated.View style={{ transform: [{ rotate: rotation }] }}>
              <IconCollage
                name="ellipsis"
                style={iconStyles.ellipsis}
                weight={"bold"}
                tintColor={"#ffffff"}
                backgroundColor={"rgba(38, 40, 40, 0.25)"}
                onPress={handleOptionsPress} // Show options popup on press
              />
            </Animated.View>
          </Pressable>
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
          <View style={styles.dateButton}>
            <Text style={styles.dateButtonText}>
              {new Date(createdAt).toLocaleDateString()}
            </Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Pressable onPress={() => setShowComments(true)}>
              <View style={styles.commentsButton}>
                <Text style={styles.commentsButtonText}>Comments</Text>
              </View>
            </Pressable>
            {hasParticipants && (
              <Pressable onPress={() => setShowParticipants(true)}>
                <View style={[styles.participantsButton, { marginLeft: 8 }]}>
                  <Text style={styles.participantsButtonText}>
                    Participants
                  </Text>
                </View>
              </Pressable>
            )}
          </View>
        </View>
      </View>
      <Comments
        visible={showComments}
        onRequestClose={() => setShowComments(false)}
        collageId={collageId}
        collageAuthorId={author._id}
      />
      <Participants
        visible={showParticipants}
        onRequestClose={() => setShowParticipants(false)}
        collageId={collageId}
      />
      {currentUser === author._id ? (
        <AuthorOptions
          visible={showOptions}
          onRequestClose={() => setShowOptions(false)}
          collageId={collageId}
          isArchived={isArchived}
          handleArchivePress={handleArchivePress}
          collageData={{
            caption,
            images,
            coverImage: data.getCollageById.collage.coverImage,
            taggedUsers: data.getCollageById.collage.tagged || [],
          }}
        />
      ) : (
        <DefaultOptions
          visible={showOptions}
          onRequestClose={() => setShowOptions(false)}
          collageId={collageId}
          isSaved={isSaved}
          handleSavePress={handleSavePress}
        />
      )}
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
    height: 35,
    width: 35,
    borderRadius: 4,
    borderColor: "rgba(38, 40, 40, 0.3)",
    borderWidth: 2,
    marginRight: 6,
  },
  fullName: {
    fontWeight: "600",
    color: "#fff",
  },
  username: {
    fontWeight: "600",
    color: "#fff",
  },
  location: {
    fontSize: 12,
    color: "#fff",
  },
  actionContainer: {
    position: "absolute",
    bottom: 12,
    right: 12,
    flexDirection: "column", // Changed to column for vertical alignment
    alignItems: "center",
  },
  iconSpacer: {
    marginTop: 12, // Adds spacing between icons
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
    color: "#fff",
  },
  dateButton: {
    backgroundColor: "#1C1C1C", // Dark background for Date button
    borderRadius: 20, // Rounded corners
    paddingVertical: 6,
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  dateButtonText: {
    color: "#696969", // Light grey text
    fontSize: 12,
    fontWeight: "500",
  },
  commentsButton: {
    backgroundColor: "#252525", // Darker background for Comments button
    borderRadius: 20, // Rounded corners
    paddingVertical: 6,
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  commentsButtonText: {
    color: "#fff", // White text
    fontSize: 12,
    fontWeight: "500",
  },
  participantsButton: {
    backgroundColor: "#252525", // Darker background for Participants button
    borderRadius: 20, // Rounded corners
    paddingVertical: 6,
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  participantsButtonText: {
    color: "#fff", // White text
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
