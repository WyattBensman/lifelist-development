import React, { useEffect, useState, useRef } from "react";
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
  Text,
  PanResponder,
  ActivityIndicator,
} from "react-native";
import { useMutation } from "@apollo/client";
import { GET_AND_TRANSFER_CAMERA_SHOT } from "../../../utils/mutations/cameraMutations";
import Icon from "../../../components/Icons/Icon";
import { useDevelopingRoll } from "../../../contexts/DevelopingRollContext";
import * as Sharing from "expo-sharing";
import { iconStyles } from "../../../styles";
import DangerAlert from "../../../components/Alerts/DangerAlert";
import { useNavigation } from "@react-navigation/native";
import ViewShotHeader from "../../../components/Headers/ViewShotHeader";
import ViewShotCard from "./ViewShotCard";
import IconButtonWithLabel from "../../../components/Icons/IconButtonWithLabel";
import { useCameraRoll } from "../../../contexts/CameraRollContext";
import { useAdminProfile } from "../../../contexts/AdminProfileContext";

const { width } = Dimensions.get("window");
const aspectRatio = 3 / 2;
const imageHeight = width * aspectRatio;

export default function ViewDevelopingShot({ shotId, onClose }) {
  const { developingShots, removeShotFromDevelopingRoll } = useDevelopingRoll();
  const { addShotToRoll } = useCameraRoll();
  const { addMoment } = useAdminProfile();
  const [getAndTransferCameraShot, { loading, error }] = useMutation(
    GET_AND_TRANSFER_CAMERA_SHOT
  );
  const [imageUri, setImageUri] = useState(null);
  const [isAdditionalOptionsVisible, setIsAdditionalOptionsVisible] =
    useState(false); // Toggle state for "Album" and "Experience"
  const [isDeleteAlertVisible, setIsDeleteAlertVisible] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [isPostingToMoment, setIsPostingToMoment] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pan = useRef(new Animated.ValueXY()).current;
  const navigation = useNavigation(); // Navigation for Album and Experience
  const threshold = 75;

  useEffect(() => {
    const fetchShot = async () => {
      try {
        const response = await getAndTransferCameraShot({
          variables: { shotId },
        });

        if (response.data.getAndTransferCameraShot.success) {
          const fullShot = response.data.getAndTransferCameraShot.cameraShot;

          // Set the image URI
          setImageUri(fullShot.image);

          // Add the shot to the CameraRoll cache
          await addShotToRoll(fullShot);

          // Remove from DevelopingRoll if it exists
          const shotExists = developingShots.some(
            (shot) => shot._id === shotId
          );
          if (shotExists) {
            removeShotFromDevelopingRoll(shotId);
          }
        } else {
          console.error(
            "Error:",
            response.data.getAndTransferCameraShot.message
          );
        }
      } catch (err) {
        console.error("Error fetching full image:", err);
      }
    };

    fetchShot();
  }, [
    shotId,
    getAndTransferCameraShot,
    addShotToRoll,
    removeShotFromDevelopingRoll,
  ]);

  useEffect(() => {
    if (imageUri) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [imageUri]);

  // Configure PanResponder for drag gestures
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (evt, gestureState) => {
        const { dx, dy } = gestureState;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > threshold) {
          onClose();
        } else {
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  // ACTIONS
  const handlePostToMomentPress = () => {
    setIsPostingToMoment(true); // Enable confirmation workflow
  };

  const handleConfirmPostToMoment = async () => {
    try {
      if (!shotId) return;

      // Use AdminProfileContext's addMoment
      await addMoment({ cameraShotId: shotId });

      // Success feedback
      setFeedbackMessage("Moment successfully posted!");
    } catch (err) {
      console.error("Error posting moment:", err);
      setFeedbackMessage("Failed to post moment.");
    } finally {
      setTimeout(() => setFeedbackMessage(""), 2000);
      setIsPostingToMoment(false);
    }
  };

  const handleCancelPostToMoment = () => {
    setIsPostingToMoment(false);
  };

  const handleSharePress = async () => {
    if (!imageUri) {
      alert("No image to share.");
      return;
    }
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(imageUri);
    } else {
      alert("Sharing is not available on this device.");
    }
  };

  const handleDeletePress = () => setIsDeleteAlertVisible(true);

  const handleAddToPress = () => setIsAdditionalOptionsVisible(true);

  const handleAlbumPress = () =>
    navigation.navigate("AddShotToAlbum", { shotId });

  const handleExperiencePress = () =>
    navigation.navigate("AddShotToExperience", { shotId });

  const resetToMainButtons = () => {
    setIsAdditionalOptionsVisible(false);
    setIsPostingToMoment(false);
  };

  const confirmDelete = async () => {
    try {
      const shotExists = developingShots.some((shot) => shot._id === shotId);
      if (shotExists) {
        removeShotFromDevelopingRoll(shotId); // Remove the shot from the developing roll
      }
      onClose(); // Close the view
    } catch (error) {
      console.error("Error deleting shot:", error);
      alert("Failed to delete shot.");
    } finally {
      setIsDeleteAlertVisible(false);
    }
  };

  if (loading || !imageUri) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>
          {error ? "Failed to load image." : "Loading image..."}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ViewShotHeader
        arrow={
          <Icon
            name="xmark"
            style={iconStyles.exit}
            onPress={() => navigation.goBack()}
            weight="semibold"
          />
        }
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

      {/* Draggable Image */}
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          {
            transform: [{ translateX: pan.x }, { translateY: pan.y }],
            width: width,
          },
        ]}
      >
        <ViewShotCard imageUrl={imageUri} shotId={shotId} />
      </Animated.View>

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
          {!isPostingToMoment ? (
            !isAdditionalOptionsVisible ? (
              <>
                <IconButtonWithLabel
                  iconName="paperplane"
                  label="Share"
                  onPress={handleSharePress}
                />
                <IconButtonWithLabel
                  iconName="rectangle.portrait.on.rectangle.portrait.angled"
                  label="Post Moment"
                  onPress={handlePostToMomentPress}
                />
                <IconButtonWithLabel
                  iconName="folder"
                  label="Add To"
                  onPress={handleAddToPress}
                />
              </>
            ) : (
              <>
                <IconButtonWithLabel
                  iconName="folder"
                  label="Album"
                  onPress={handleAlbumPress}
                />
                <IconButtonWithLabel
                  iconName="star"
                  label="Experience"
                  onPress={handleExperiencePress}
                />
                <IconButtonWithLabel
                  iconName="arrow.left"
                  label="Back"
                  onPress={resetToMainButtons}
                />
              </>
            )
          ) : (
            <>
              <IconButtonWithLabel
                iconName="checkmark"
                label={posting ? "Posting..." : "Confirm Moment"}
                onPress={handleConfirmPostToMoment}
                disabled={posting}
              />
              <IconButtonWithLabel
                iconName="xmark"
                label="Cancel"
                onPress={handleCancelPostToMoment}
              />
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
  container: {
    flex: 1,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 4,
    resizeMode: "cover",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#fff",
    fontSize: 16,
    marginTop: 10,
  },
  bottomContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  iconWithLabel: {
    justifyContent: "center",
    alignItems: "center",
  },
  labelText: {
    color: "#fff",
    fontSize: 12,
    marginTop: 5,
  },
  iconButton: {
    backgroundColor: "#252525",
    borderRadius: 50,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  trashIcon: {
    height: 18.28,
    width: 15,
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
});
