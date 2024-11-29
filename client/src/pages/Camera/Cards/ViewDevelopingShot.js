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

const { width } = Dimensions.get("window");
const aspectRatio = 3 / 2;
const imageHeight = width * aspectRatio;

export default function ViewDevelopingShot({ shotId, onClose }) {
  const { removeShotFromCache } = useDevelopingRoll();
  const [getAndTransferCameraShot, { data, loading, error }] = useMutation(
    GET_AND_TRANSFER_CAMERA_SHOT
  );
  const [imageUri, setImageUri] = useState(null);
  const [isRemovedFromCache, setIsRemovedFromCache] = useState(false); // Track cache removal
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pan = useRef(new Animated.ValueXY()).current;
  const threshold = 75;

  // Fetch the full-quality image
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

          if (!isRemovedFromCache) {
            removeShotFromCache(shotId);
            setIsRemovedFromCache(true); // Ensure the cache is updated only once
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
    removeShotFromCache,
    isRemovedFromCache,
  ]);

  // Trigger fade-in animation when the image is loaded
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

  const handleShare = async () => {
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(imageUri);
    } else {
      alert("Sharing is not available on this device.");
    }
  };

  const handleDelete = () => {
    alert("Delete logic to be implemented.");
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

  console.log(imageUri);

  return (
    <View style={styles.container}>
      {/* Blurred Background */}
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose}>
        <View style={styles.blurOverlay} />
      </Pressable>

      {/* Draggable Image */}
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          styles.imageContainer,
          {
            transform: [{ translateX: pan.x }, { translateY: pan.y }],
          },
        ]}
      >
        <Image source={{ uri: imageUri }} style={styles.image} />
      </Animated.View>

      {/* Close Button */}
      <View style={styles.closeButton}>
        <Icon
          name="chevron.backward"
          onPress={onClose}
          style={iconStyles.backArrow}
          weight="semibold"
        />
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtonsContainer}>
        <Pressable style={styles.actionButton} onPress={handleShare}>
          <Icon
            name="paperplane"
            style={{ height: 19, width: 19 }}
            backgroundColor={"transparent"}
            tintColor="#252525"
          />
          <Text style={styles.actionText}>Share</Text>
        </Pressable>
        <Pressable style={styles.actionButton} onPress={handleDelete}>
          <Icon
            name="trash"
            style={{ height: 20, width: 20 }}
            backgroundColor={"transparent"}
            tintColor="#252525"
          />
          <Text style={styles.actionText}>Delete</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: 60,
    left: 20,
    zIndex: 10,
  },
  imageContainer: {
    width: width - 60,
    height: imageHeight,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 4,
    resizeMode: "cover",
  },
  actionButtonsContainer: {
    flexDirection: "row",
    position: "absolute",
    bottom: 40,
    justifyContent: "space-around",
    width: "75%",
  },
  actionButton: {
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
    backgroundColor: "#fff",
    borderRadius: 30,
    flexDirection: "row",
    width: 120,
  },
  actionText: {
    fontSize: 14,
    color: "#000",
    fontWeight: "500",
    marginLeft: 4,
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
});
