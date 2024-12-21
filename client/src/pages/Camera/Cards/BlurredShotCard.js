import React, { useState, useEffect } from "react";
import { Dimensions, StyleSheet, View, Text, Pressable } from "react-native";
import { Image } from "expo-image";
import { BlurView } from "expo-blur";
import { fetchCachedImageUri } from "../../../utils/cacheHelper";
import moment from "moment";

const { width } = Dimensions.get("window");
const spacing = 1.5;
const imageWidth = (width - spacing * 2) / 2;
const imageHeight = (imageWidth * 3) / 2;

export default function BlurredShotCard({ shot, onShotDeveloped, onPress }) {
  const [timeLeft, setTimeLeft] = useState(null);
  const [isDeveloped, setIsDeveloped] = useState(shot.isDeveloped);
  const [imageUri, setImageUri] = useState(null);

  useEffect(() => {
    const loadImageUri = async () => {
      const cacheKey = `developing_shot_${shot._id}`;
      const cachedUri = await fetchCachedImageUri(
        cacheKey,
        shot.imageThumbnail
      );
      setImageUri(cachedUri);
    };

    loadImageUri();
  }, [shot.imageThumbnail, shot._id]);

  useEffect(() => {
    const now = moment();
    const readyTime = moment(shot.readyToReviewAt);

    if (now.isAfter(readyTime)) {
      setIsDeveloped(true);
      setTimeLeft(null);
      onShotDeveloped(shot._id);
    } else {
      const duration = moment.duration(readyTime.diff(now));
      setIsDeveloped(false);
      setTimeLeft(duration);
    }
  }, [shot.readyToReviewAt]);

  useEffect(() => {
    if (!timeLeft) return;

    const interval = setInterval(() => {
      const now = moment();
      const readyTime = moment(shot.readyToReviewAt);
      const duration = moment.duration(readyTime.diff(now));

      if (duration.asSeconds() <= 0) {
        setIsDeveloped(true);
        setTimeLeft(null);
        clearInterval(interval);
        onShotDeveloped(shot._id);
      } else {
        setTimeLeft(duration);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, shot.readyToReviewAt]);

  return (
    <Pressable onPress={onPress} style={styles.container}>
      <View style={styles.imageContainer}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : (
          <Text style={styles.loadingText}>Loading...</Text>
        )}
        <BlurView intensity={20} style={styles.blurView}>
          {!isDeveloped && timeLeft && (
            <Text style={styles.timerText}>
              {timeLeft.minutes()}:
              {timeLeft.seconds().toString().padStart(2, "0")}
            </Text>
          )}
          {isDeveloped && <Text style={styles.readyText}>Ready!</Text>}
        </BlurView>
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
    borderRadius: 10,
  },
  blurView: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  loadingText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
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
