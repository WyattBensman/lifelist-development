import React, { useEffect, useRef } from "react";
import { View, TouchableOpacity, Animated, Dimensions } from "react-native";
import { displayStyles } from "../../../styles";

const { width } = Dimensions.get("window");
const MOMENT_DURATION = 10000; // 10 seconds

export default function MomentDisplay({
  moments,
  currentIndex,
  onNextMoment,
  onPrevMoment,
}) {
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    resetTimer();
  }, [currentIndex]);

  const resetTimer = () => {
    progressAnim.setValue(0);
    startTimer();
  };

  const startTimer = () => {
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: MOMENT_DURATION,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished) onNextMoment();
    });
  };

  const currentMoment = moments[currentIndex];

  return (
    <View>
      {/* Progress Bar */}
      <View style={displayStyles.progressBarContainer}>
        {moments.map((_, i) => (
          <View key={i} style={displayStyles.progressSegment}>
            <Animated.View
              style={[
                displayStyles.progressFill,
                {
                  width:
                    i < currentIndex
                      ? "100%"
                      : i === currentIndex
                      ? progressAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: ["0%", "100%"],
                        })
                      : "0%",
                },
                i === currentIndex && displayStyles.activeProgressFill,
              ]}
            />
          </View>
        ))}
      </View>

      {/* Touchable Navigation */}
      <TouchableOpacity
        activeOpacity={1}
        style={displayStyles.touchableContainer}
        onPress={(e) => {
          const touchX = e.nativeEvent.locationX;
          if (touchX < width / 2) {
            onPrevMoment();
          } else {
            onNextMoment();
          }
        }}
      >
        <View style={displayStyles.imageContainer}>
          <Image
            source={{ uri: currentMoment.cameraShot.image }}
            style={displayStyles.image}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
}
