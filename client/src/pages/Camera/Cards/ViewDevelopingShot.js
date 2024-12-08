import React, { useEffect, useState, useRef } from "react";
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
  Pressable,
  Text,
  PanResponder,
  ActivityIndicator,
  Image,
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

const { width } = Dimensions.get("window");
const aspectRatio = 3 / 2;
const imageHeight = width * aspectRatio;

export default function ViewDevelopingShot({ shotId, onClose }) {
  const { developingShots, removeShotFromDevelopingRoll } = useDevelopingRoll();
  const [getAndTransferCameraShot, { loading, error }] = useMutation(
    GET_AND_TRANSFER_CAMERA_SHOT
  );
  const [imageUri, setImageUri] = useState(null);
  const [isAdditionalOptionsVisible, setIsAdditionalOptionsVisible] =
    useState(false); // Toggle state for "Album" and "Experience"
  const [isDeleteAlertVisible, setIsDeleteAlertVisible] = useState(false);

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
          const fullImage =
            response.data.getAndTransferCameraShot.cameraShot.image;
          setImageUri(fullImage);

          // Remove from cache only if it exists in developingShots
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
  }, [shotId, getAndTransferCameraShot, removeShotFromDevelopingRoll]);

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

  const resetToMainButtons = () => setIsAdditionalOptionsVisible(false);

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
        <ViewShotCard imageUrl={item.image} shotId={item._id} />
      </Animated.View>

      {/* Bottom Container */}
      <View style={styles.bottomContainer}>
        {!isAdditionalOptionsVisible ? (
          // Main button set
          <>
            <Pressable style={styles.iconWithLabel} onPress={handleSharePress}>
              <Pressable style={styles.iconButton} onPress={handleSharePress}>
                <Icon
                  name="paperplane"
                  style={styles.icon}
                  weight="bold"
                  onPress={handleSharePress}
                />
              </Pressable>
              <Text style={styles.labelText}>Share</Text>
            </Pressable>

            <View style={styles.iconWithLabel}>
              <Pressable style={styles.iconButton} onPress={handleDeletePress}>
                <Icon
                  name="rectangle.portrait.on.rectangle.portrait.angled"
                  style={styles.icon}
                  weight="bold"
                />
              </Pressable>
              <Text style={styles.labelText}>Post to Story</Text>
            </View>

            <Pressable style={styles.iconWithLabel} onPress={handleAddToPress}>
              <Pressable style={styles.iconButton} onPress={handleAddToPress}>
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
          // Secondary button set (Album and Experience)
          <>
            <Pressable style={styles.iconWithLabel} onPress={handleAlbumPress}>
              <Pressable style={styles.iconButton} onPress={handleAlbumPress}>
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

            <View style={styles.iconWithLabel} onPress={resetToMainButtons}>
              <Pressable style={styles.iconButton} onPress={resetToMainButtons}>
                <Icon
                  name="arrow.left"
                  style={styles.icon}
                  weight="bold"
                  onPress={resetToMainButtons}
                />
              </Pressable>
              <Text style={styles.labelText}>Back</Text>
            </View>
          </>
        )}
      </View>

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
    borderWidth: 3,
    borderColor: "red",
  },
  /*   imageContainer: {
    width: width - 60,
    height: imageHeight,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  }, */
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
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 20,
    backgroundColor: "#121212",
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
});
