import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  Text,
  Image,
} from "react-native";
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { layoutStyles, iconStyles } from "../../../styles";
import Icon from "../../../components/Icons/Icon";
import ViewShotHeader from "../../../components/Headers/ViewShotHeader";

import { useQuery } from "@apollo/client";
import { GET_USER_STORIES } from "../../../utils/queries/storyQueries";
import ViewShotCard from "../../Camera/Cards/ViewShotCard";
import { useNavigationContext } from "../../../contexts/NavigationContext";

const { width } = Dimensions.get("window");
const aspectRatio = 3 / 2;
const imageHeight = width * aspectRatio;

export default function Stories() {
  const navigation = useNavigation();
  const route = useRoute();
  const { userId } = route.params;
  const { setIsTabBarVisible } = useNavigationContext();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentStory, setCurrentStory] = useState(null);

  useEffect(() => {
    setIsTabBarVisible(false);
    return () => setIsTabBarVisible(true);
  }, []);

  const { data, loading, error } = useQuery(GET_USER_STORIES, {
    variables: { userId },
    fetchPolicy: "network-only",
  });

  const stories = data?.getUserStories || [];

  useEffect(() => {
    if (stories.length > 0) {
      setCurrentStory(stories[0]); // Initialize with the first story
    }
  }, [stories]);

  const handleViewableItemsChanged = useCallback(
    ({ viewableItems }) => {
      if (viewableItems.length > 0) {
        const newIndex = viewableItems[0].index;
        setCurrentIndex(newIndex);
        setCurrentStory(stories[newIndex]);
      }
    },
    [stories]
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Failed to load stories.</Text>
      </View>
    );
  }

  const date = currentStory
    ? new Date(currentStory.createdAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";
  const time = currentStory
    ? new Date(currentStory.createdAt).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      })
    : "";

  return (
    <View style={layoutStyles.wrapper}>
      <ViewShotHeader
        arrow={
          <Icon
            name="xmark"
            style={iconStyles.exit}
            onPress={() => navigation.goBack()}
            weight="semibold"
          />
        }
        ellipsis={null} // No delete button for viewing user stories
        hasBorder={false}
      />

      <View style={{ height: imageHeight }}>
        <FlatList
          data={stories}
          renderItem={({ item, index }) => (
            <View style={{ width }}>
              <ViewShotCard
                imageUrl={item.cameraShot.image}
                shotId={item.cameraShot._id}
                fullResolution={item.cameraShot.image}
                isVisible={index === currentIndex}
              />
            </View>
          )}
          keyExtractor={(item) => item._id.toString()}
          horizontal
          pagingEnabled
          initialNumToRender={3}
          maxToRenderPerBatch={5}
          onViewableItemsChanged={handleViewableItemsChanged}
          showsHorizontalScrollIndicator={false}
          initialScrollIndex={0}
          getItemLayout={(data, index) => ({
            length: width,
            offset: width * index,
            index,
          })}
        />
      </View>

      {/* User Info */}
      {currentStory && (
        <View style={styles.userInfoContainer}>
          <Image
            source={{ uri: currentStory.author.profilePicture }}
            style={styles.profilePicture}
          />
          <View style={styles.userTextContainer}>
            <Text style={styles.fullName}>{currentStory.author.fullName}</Text>
            <Text style={styles.username}>@{currentStory.author.username}</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
  },
  bottomContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
  },
  errorText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  labelText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: 500,
    marginTop: 6,
  },
  userInfoContainer: {
    flexDirection: "row", // Row layout for profile picture and text
    alignItems: "center", // Center vertically
    justifyContent: "flex-start", // Align to the left
    paddingVertical: 16,
    paddingHorizontal: 16, // Add padding for spacing
    backgroundColor: "#121212", // Optional, for visibility
  },
  profilePicture: {
    width: 44,
    height: 44,
    borderRadius: 4,
    marginRight: 12, // Space between image and text
  },
  userTextContainer: {
    flexDirection: "column", // Stack full name and username
  },
  fullName: {
    color: "#fff",
    fontWeight: "bold",
  },
  username: {
    color: "#aaa",
    fontSize: 12,
  },
});
