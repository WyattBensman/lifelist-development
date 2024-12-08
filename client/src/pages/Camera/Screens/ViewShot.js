import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Dimensions,
  Text,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useCameraRoll } from "../../../contexts/CameraRollContext";
import { layoutStyles, iconStyles } from "../../../styles";
import Icon from "../../../components/Icons/Icon";
import ViewShotHeader from "../../../components/Headers/ViewShotHeader";
import ViewShotCard from "../Cards/ViewShotCard";
import * as Sharing from "expo-sharing";
import DangerAlert from "../../../components/Alerts/DangerAlert";
import { POST_STORY } from "../../../utils/mutations/storyMutations";
import { useMutation } from "@apollo/client";

const { width } = Dimensions.get("window");
const aspectRatio = 3 / 2;
const imageHeight = width * aspectRatio;

export default function ViewShot() {
  const navigation = useNavigation();
  const route = useRoute();
  const { shotId, fromAlbum } = route.params;

  const {
    shots,
    fetchFullResolutionImage,
    preloadFullResolutionImages,
    removeShotFromRoll,
  } = useCameraRoll();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentShot, setCurrentShot] = useState(null);
  const [isPostingToStory, setIsPostingToStory] = useState(false);
  const [isAdditionalOptionsVisible, setIsAdditionalOptionsVisible] =
    useState(false);
  const [isDeleteAlertVisible, setIsDeleteAlertVisible] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");

  // Set the initial index based on shotId
  useEffect(() => {
    const initialIndex = shots.findIndex((shot) => shot._id === shotId);
    setCurrentIndex(initialIndex);
  }, [shotId, shots]);

  const handleViewableItemsChanged = useCallback(
    async ({ viewableItems }) => {
      if (viewableItems.length > 0) {
        const newIndex = viewableItems[0].index;
        setCurrentIndex(newIndex);

        // Preload adjacent images
        await preloadFullResolutionImages(newIndex);

        // Fetch the current shot's full-resolution image
        const shot = shots[newIndex];
        if (shot) {
          const fullResolutionImage = await fetchFullResolutionImage(shot._id);
          setCurrentShot({ ...shot, image: fullResolutionImage });
        }
      }
    },
    [shots, fetchFullResolutionImage, preloadFullResolutionImages]
  );

  const [postStory, { loading: posting, error: postError }] =
    useMutation(POST_STORY);

  // ACTIONS
  const handlePostToStoryPress = () => {
    setIsPostingToStory(true); // Enable confirmation workflow
  };

  const handleConfirmPostToStory = async () => {
    try {
      if (!currentShot?._id) return;

      // Run the mutation
      await postStory({ variables: { cameraShotId: currentShot._id } });

      // Success feedback
      setFeedbackMessage("Story successfully posted!");
    } catch (err) {
      console.error("Error posting story:", err);
      setFeedbackMessage("Failed to post story.");
    } finally {
      // Always reset the state
      setTimeout(() => setFeedbackMessage(""), 2000); // Clear feedback after 2 seconds
      setIsPostingToStory(false);
    }
  };

  const handleCancelPostToStory = () => {
    setIsPostingToStory(false);
  };

  const handleSharePress = async () => {
    if (!currentShot?.image) return;
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(currentShot.image);
    } else {
      alert("Sharing is not available on this device.");
    }
  };

  const handleDeletePress = () => setIsDeleteAlertVisible(true);

  const handleAddToPress = () => setIsAdditionalOptionsVisible(true);

  const handleAlbumPress = () => {
    navigation.navigate("AddShotToAlbum", { shotId: currentShot?._id });
  };

  const handleExperiencePress = () => {
    navigation.navigate("AddShotToExperience", { shotId: currentShot?._id });
  };

  const resetToMainButtons = () => {
    setIsAdditionalOptionsVisible(false);
    setIsPostingToStory(false);
  };

  const confirmDelete = async () => {
    try {
      const shotId = currentShot?._id;
      if (shotId) {
        await removeShotFromRoll(shotId);
        const nextIndex =
          currentIndex === shots.length - 1 ? currentIndex - 1 : currentIndex;
        setCurrentIndex(nextIndex);
      }
    } catch (error) {
      console.error("Error deleting shot:", error);
      alert("Failed to delete shot.");
    } finally {
      setIsDeleteAlertVisible(false);
    }
  };

  if (shots.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const date = currentShot
    ? new Date(currentShot.capturedAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";
  const time = currentShot
    ? new Date(currentShot.capturedAt).toLocaleTimeString("en-US", {
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
        date={date}
        time={time}
        ellipsis={
          <Icon
            name="trash"
            style={styles.trashIcon}
            weight="bold"
            onPress={handleDeletePress}
            noFill={true}
            tintColor={"red"}
          />
        }
        hasBorder={false}
      />

      <View style={{ height: imageHeight }}>
        <FlatList
          data={shots}
          renderItem={({ item, index }) => (
            <View style={{ width }}>
              <ViewShotCard
                imageUrl={item.image}
                shotId={item._id}
                fullResolution={currentShot?.image || item.imageThumbnail}
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
          initialScrollIndex={currentIndex}
          getItemLayout={(data, index) => ({
            length: width,
            offset: width * index,
            index,
          })}
        />
      </View>

      {/* Feedback */}
      {feedbackMessage ? (
        <View style={styles.feedbackContainer}>
          <View style={styles.feedbackBox}>
            <Text style={styles.feedbackText}>{feedbackMessage}</Text>
          </View>
        </View>
      ) : (
        // Bottom Container
        <View style={styles.bottomContainer}>
          {!isPostingToStory ? (
            !isAdditionalOptionsVisible ? (
              <>
                <Pressable
                  style={styles.iconWithLabel}
                  onPress={handleSharePress}
                >
                  <Pressable
                    style={styles.iconButton}
                    onPress={handleSharePress}
                  >
                    <Icon
                      name="paperplane"
                      style={styles.icon}
                      weight="bold"
                      onPress={handleSharePress}
                    />
                  </Pressable>
                  <Text style={styles.labelText}>Share</Text>
                </Pressable>

                <Pressable
                  style={styles.iconWithLabel}
                  onPress={handlePostToStoryPress}
                >
                  <Pressable
                    style={styles.iconButton}
                    onPress={handlePostToStoryPress}
                  >
                    <Icon
                      name="rectangle.portrait.on.rectangle.portrait.angled"
                      style={styles.icon}
                      weight="bold"
                      onPress={handlePostToStoryPress}
                    />
                  </Pressable>
                  <Text style={styles.labelText}>Post to Story</Text>
                </Pressable>

                <Pressable
                  style={styles.iconWithLabel}
                  onPress={handleAddToPress}
                >
                  <Pressable
                    style={styles.iconButton}
                    onPress={handleAddToPress}
                  >
                    <Icon
                      name="folder"
                      style={styles.icon}
                      weight="bold"
                      onPress={handleAddToPress}
                    />
                  </Pressable>
                  <Text style={styles.labelText}>Add To</Text>
                </Pressable>
              </>
            ) : (
              <>
                <Pressable
                  style={styles.iconWithLabel}
                  onPress={handleAlbumPress}
                >
                  <Pressable
                    style={styles.iconButton}
                    onPress={handleAlbumPress}
                  >
                    <Icon
                      name="folder"
                      style={styles.icon}
                      weight="bold"
                      onPress={handleAlbumPress}
                    />
                  </Pressable>
                  <Text style={styles.labelText}>Album</Text>
                </Pressable>

                <Pressable
                  style={styles.iconWithLabel}
                  onPress={handleExperiencePress}
                >
                  <Pressable
                    style={styles.iconButton}
                    onPress={handleExperiencePress}
                  >
                    <Icon
                      name="star"
                      style={styles.icon}
                      weight="bold"
                      onPress={handleExperiencePress}
                    />
                  </Pressable>
                  <Text style={styles.labelText}>Experience</Text>
                </Pressable>

                <Pressable
                  style={styles.iconWithLabel}
                  onPress={resetToMainButtons}
                >
                  <Pressable
                    style={styles.iconButton}
                    onPress={resetToMainButtons}
                  >
                    <Icon
                      name="arrow.left"
                      style={styles.icon}
                      weight="bold"
                      onPress={resetToMainButtons}
                    />
                  </Pressable>
                  <Text style={styles.labelText}>Back</Text>
                </Pressable>
              </>
            )
          ) : (
            <>
              <Pressable
                style={styles.iconWithLabel}
                onPress={handleConfirmPostToStory}
                disabled={posting}
              >
                <Pressable
                  style={[styles.iconButton, posting && styles.disabledButton]}
                  onPress={handleConfirmPostToStory}
                  disabled={posting}
                >
                  <Icon
                    name="checkmark"
                    style={styles.icon}
                    weight="bold"
                    onPress={handleConfirmPostToStory}
                  />
                </Pressable>
                <Text style={styles.labelText}>
                  {posting ? "Posting..." : "Confirm Story"}
                </Text>
              </Pressable>

              <Pressable
                style={styles.iconWithLabel}
                onPress={handleCancelPostToStory}
              >
                <Pressable
                  style={styles.iconButton}
                  onPress={handleCancelPostToStory}
                >
                  <Icon
                    name="xmark"
                    style={styles.icon}
                    weight="bold"
                    onPress={handleCancelPostToStory}
                  />
                </Pressable>
                <Text style={styles.labelText}>Cancel</Text>
              </Pressable>
            </>
          )}
        </View>
      )}

      <DangerAlert
        visible={isDeleteAlertVisible}
        onRequestClose={() => setIsDeleteAlertVisible(false)}
        title="Delete Camera Shot"
        message="Are you sure you want to delete this shot?"
        onConfirm={confirmDelete}
        onCancel={() => setIsDeleteAlertVisible(false)}
        cancelButtonText="Discard"
      />
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#121212",
  },
  iconWithLabel: {
    justifyContent: "center",
    alignItems: "center",
  },
  labelText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: 500,
    marginTop: 6,
  },
  iconButton: {
    backgroundColor: "#252525",
    borderRadius: 50,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 20,
  },
  feedbackContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
  },
  feedbackBox: {
    backgroundColor: "#252525",
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 32,
  },
  feedbackText: {
    color: "#fff",
    backgroundColor: "#252525",
    paddingVertical: 8,
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
  },
  trashIcon: {
    height: 18.28,
    width: 15,
  },
  disabledButton: {
    opacity: 0.5,
  },
});
