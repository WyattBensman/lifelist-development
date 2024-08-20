import React from "react";
import { View, StyleSheet, Text, Pressable, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import FlashOutlineIcon from "../Icons/FlashOutlineIcon";
import FlashSolidIcon from "../Icons/FlashSolidIcon";
import FlipCameraIcon from "../Icons/FlipCameraIcon";
import IconLarge from "../../../components/Icons/IconLarge";
import { iconStyles } from "../../../styles/iconStyles";

export default function Footer({
  rotation,
  flash,
  toggleFlash,
  toggleCameraFacing,
  handleZoomChange,
  footerHeight,
  disabled,
  handleTakePhoto,
}) {
  const navigation = useNavigation();

  const navigateToCameraRoll = () => {
    if (!disabled) {
      navigation.navigate("CameraRoll");
    }
  };

  const navigateToDevelopingRoll = () => {
    if (!disabled) {
      navigation.navigate("DevelopingRoll");
    }
  };

  const [zoomLevel, setZoomLevel] = React.useState(1);

  const handleZoomPress = (zoom) => {
    if (!disabled) {
      setZoomLevel(zoom);
      handleZoomChange(zoom);
    }
  };

  return (
    <View style={[styles.wrapper, { height: footerHeight }]}>
      <View style={[styles.row, disabled && styles.disabled]}>
        <Pressable
          onPress={toggleFlash}
          style={styles.rowIcon}
          disabled={disabled}
        >
          {flash === "off" ? <FlashOutlineIcon /> : <FlashSolidIcon />}
        </Pressable>
        <View style={styles.zoomContainer}>
          <Pressable
            style={[
              styles.zoomButton,
              zoomLevel === 1 && styles.activeZoomButton,
              disabled && styles.disabledButton,
            ]}
            disabled={disabled}
          >
            <Text
              style={[
                styles.zoomText,
                zoomLevel === 1 && styles.activeZoomText,
                disabled && styles.disabledText,
              ]}
            >
              1x
            </Text>
          </Pressable>
        </View>
        <Pressable
          onPress={toggleCameraFacing}
          style={styles.rowIcon}
          disabled={disabled}
        >
          <FlipCameraIcon />
        </Pressable>
      </View>
      <View style={styles.container}>
        <Animated.View style={{ transform: [{ rotate: rotation }], zIndex: 1 }}>
          <Pressable
            onPress={navigateToCameraRoll}
            style={styles.iconContainer}
            disabled={disabled}
          >
            <IconLarge
              name="photo"
              style={[iconStyles.photoGallery, disabled && styles.disabledIcon]}
              tintColor="#fff"
              onPress={navigateToCameraRoll}
              disabled={disabled}
            />
          </Pressable>
        </Animated.View>
        <View style={styles.circleContainer}>
          <Pressable onPress={handleTakePhoto} disabled={disabled}>
            <LinearGradient
              colors={["#6AB952", "#5FC4ED"]}
              style={[styles.circleOutline, disabled && styles.disabledCircle]}
            >
              <View style={styles.circle} />
            </LinearGradient>
          </Pressable>
        </View>
        <Animated.View style={{ transform: [{ rotate: rotation }] }}>
          <Pressable
            onPress={navigateToDevelopingRoll}
            style={styles.iconContainer}
            disabled={disabled}
          >
            <IconLarge
              name="film"
              style={[
                iconStyles.inDevelopment,
                disabled && styles.disabledIcon,
              ]}
              tintColor="#fff"
              onPress={navigateToDevelopingRoll}
              disabled={disabled}
            />
          </Pressable>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
    alignItems: "center",
    backgroundColor: "#121212",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    backgroundColor: "#1C1C1C",
    borderRadius: 50,
    paddingVertical: 1,
    marginTop: 8,
    marginBottom: 28,
    width: "60%",
  },
  disabled: {
    opacity: 0.5,
  },
  zoomContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center", // Center the zoom buttons
    borderRadius: 25,
    paddingHorizontal: 8,
  },
  zoomButton: {
    padding: 10,
    alignItems: "center", // Center text within button
    justifyContent: "center", // Center text within button
  },
  activeZoomButton: {
    backgroundColor: "#6AB95230",
    borderRadius: 25,
  },
  zoomText: {
    color: "#fff",
    fontSize: 12,
    textAlign: "center", // Ensure text is centered
  },
  activeZoomText: {
    fontWeight: "bold",
  },
  rowIcon: {
    alignItems: "center",
    justifyContent: "center", // Center icon vertically and horizontally
    width: 45,
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 32,
    zIndex: 1,
    width: "100%",
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center", // Center icons vertically and horizontally
    width: 75,
  },
  circleContainer: {
    justifyContent: "center", // Center circle vertically
    alignItems: "center", // Center circle horizontally
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  circleOutline: {
    width: 72,
    height: 72,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center", // Center circle content
  },
  disabledCircle: {
    opacity: 0.5,
  },
  circle: {
    width: 60,
    height: 60,
    borderRadius: 50,
    backgroundColor: "#ececec",
  },
  disabledIcon: {
    opacity: 0.5,
  },
  disabledButton: {
    opacity: 0.5,
  },
  disabledText: {
    color: "#696969",
  },
});
