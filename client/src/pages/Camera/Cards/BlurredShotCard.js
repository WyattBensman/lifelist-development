import React, { useState, useEffect } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  View,
  Text,
  Pressable,
} from "react-native";
import { BlurView } from "expo-blur";
import { BASE_URL } from "../../../utils/config";
import moment from "moment";
import { useMutation } from "@apollo/client";
import { TRANSFER_CAMERA_SHOT } from "../../../utils/mutations/cameraMutations";

const { width } = Dimensions.get("window");
const spacing = 1.5;
const imageWidth = (width - spacing * 2) / 2;
const imageHeight = (imageWidth * 3) / 2;

export default function BlurredShotCard({ shot, refetchShots }) {
  const [timeLeft, setTimeLeft] = useState(null);
  const [isDeveloped, setIsDeveloped] = useState(shot.isDeveloped);
  const [blurIntensity, setBlurIntensity] = useState(50); // Start with high intensity

  const [transferCameraShot] = useMutation(TRANSFER_CAMERA_SHOT, {
    onCompleted: () => {
      refetchShots(); // Refetch shots once a transfer is successful
    },
  });

  useEffect(() => {
    // Update the countdown timer and blur intensity every second
    const interval = setInterval(() => {
      const now = moment();
      const readyTime = moment(shot.readyToReviewAt);
      const duration = moment.duration(readyTime.diff(now));

      if (duration.asSeconds() <= 0) {
        // Shot is developed
        setIsDeveloped(true);
        setBlurIntensity(0); // No blur when fully developed
        clearInterval(interval);
      } else {
        // Calculate remaining time and update blur intensity
        setTimeLeft(duration);

        const totalDevelopmentTime = moment.duration(
          moment(shot.readyToReviewAt).diff(moment(shot.capturedAt))
        );
        const remainingTime = duration.asSeconds();
        const totalTime = totalDevelopmentTime.asSeconds();
        const newBlurIntensity = Math.max(
          0,
          Math.floor((remainingTime / totalTime) * 50) // Adjust max intensity as needed
        );
        setBlurIntensity(newBlurIntensity);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [shot.readyToReviewAt, shot.capturedAt]);

  // Handle opening the shot, and transferring it if it's developed
  const handleOpenShot = async () => {
    if (isDeveloped) {
      try {
        await transferCameraShot({ variables: { shotId: shot._id } });
      } catch (error) {
        console.error("Error transferring shot:", error.message);
      }
    }
  };

  return (
    <Pressable onPress={handleOpenShot} style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: `${BASE_URL}${shot.image}` }}
          style={styles.image}
        />
        {!isDeveloped && (
          <BlurView intensity={blurIntensity} style={styles.blurView}>
            {/* Display the countdown timer */}
            {timeLeft && (
              <Text style={styles.timerText}>
                {timeLeft.minutes()}:
                {timeLeft.seconds().toString().padStart(2, "0")}
              </Text>
            )}
          </BlurView>
        )}
        {isDeveloped && <Text style={styles.readyText}>Ready!</Text>}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: imageWidth,
    height: imageHeight,
    marginBottom: spacing,
    marginRight: spacing,
  },
  imageContainer: {
    width: "100%",
    height: "100%",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  blurView: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  timerText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
  },
  readyText: {
    position: "absolute",
    bottom: 8,
    right: 8,
    backgroundColor: "rgba(255,255,255,0.8)",
    color: "#000",
    padding: 4,
    borderRadius: 4,
    fontWeight: "bold",
  },
});
