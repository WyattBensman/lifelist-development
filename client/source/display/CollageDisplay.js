import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Text,
  View,
  Pressable,
  ActivityIndicator,
  FlatList,
  Animated,
} from "react-native";
import { Image } from "expo-image";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { displayStyles, iconStyles } from "../../../styles";
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
import Comments from "../Popups/Comments";
import Participants from "../Popups/Participants";
import CollageButtonIcon from "../../../components/Icons/CollageButtonIcon";
import { useAuth } from "../../../contexts/AuthContext";
import AuthorOptions from "../Popups/AuthorOptions";
import DefaultOptions from "../Popups/DefaultOptions";
import { useAdminProfile } from "../../../contexts/AdminProfileContext";

export default function Collage({ collageId }) {
  const { currentUser } = useAuth();
  const { addRepost, removeRepost } = useAdminProfile();
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
      style={displayStyles.image}
      source={{
        uri: item,
      }}
    />
  );

  const handleScroll = (event) => {
    const index = Math.floor(
      event.nativeEvent.contentOffset.x / Dimensions.get("window").width
    );
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
    try {
      if (isReposted) {
        const { data } = await unrepostCollage({ variables: { collageId } });

        if (data?.unrepostCollage?.success) {
          await removeRepost(collageId);
          setIsReposted(false);
        }
      } else {
        const { data } = await repostCollage({ variables: { collageId } });

        if (data?.repostCollage?.success) {
          const repost = {
            _id: data.repostCollage.collage._id,
            coverImage: data.repostCollage.collage.coverImage,
            createdAt: data.repostCollage.collage.createdAt,
          };
          await addRepost(repost);
          setIsReposted(true);
        }
      }
    } catch (error) {
      console.error("Error handling repost/unrepost:", error.message);
    }
  };

  const handleSavePress = async () => {
    if (isSaved) {
      await unsaveCollage({ variables: { collageId } });
    } else {
      await saveCollage({ variables: { collageId } });
    }
  };

  const handleOptionsPress = () => {
    setShowOptions(!showOptions);
  };

  return (
    <View style={displayStyles.wrapper}>
      <View style={displayStyles.imageContainer}>
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
          <View style={displayStyles.progressBarContainer}>
            {images.map((_, index) => (
              <View key={index} style={displayStyles.progressSegment}>
                <Animated.View
                  style={[
                    displayStyles.progressFill,
                    index === currentIndex && displayStyles.activeProgressFill,
                  ]}
                />
              </View>
            ))}
          </View>
        )}
        <View style={displayStyles.actionContainer}>
          <Pressable onPress={handleLikePress}>
            <CollageButtonIcon
              name={isLiked ? "heart.fill" : "heart"}
              style={iconStyles.like}
              tintColor={isLiked ? "#ff0000" : "#ffffff"}
              onPress={handleLikePress}
            />
          </Pressable>

          <Pressable onPress={handleRepostPress}>
            <CollageButtonIcon
              name="arrow.2.squarepath"
              style={iconStyles.repost}
              tintColor={isReposted ? "#6AB952" : "#ffffff"}
              onPress={handleRepostPress}
            />
          </Pressable>

          <Pressable onPress={() => setShowComments(true)}>
            <CollageButtonIcon
              name="text.bubble"
              style={iconStyles.comment}
              tintColor="#ffffff"
              onPress={() => setShowComments(true)}
            />
          </Pressable>

          <Pressable onPress={handleOptionsPress}>
            <Animated.View style={{ transform: [{ rotate: rotation }] }}>
              <CollageButtonIcon
                name="ellipsis"
                style={iconStyles.ellipsis}
                tintColor="#ffffff"
                onPress={handleOptionsPress}
              />
            </Animated.View>
          </Pressable>
        </View>
      </View>

      {/* ADD THE AUTHOR & DEFAULT OPTIONS */}

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
