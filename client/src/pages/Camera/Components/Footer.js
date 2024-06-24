// src/components/Footer.js
import React from "react";
import { View, StyleSheet, Text, Pressable, Animated } from "react-native";
import { useMutation } from "@apollo/client";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { CREATE_CAMERA_SHOT } from "../../../utils/mutations/cameraMutations";
import { useAuth } from "../../../contexts/AuthContext";
import FlashOutlineIcon from "../Icons/FlashOutlineIcon";
import FlashSolidIcon from "../Icons/FlashSolidIcon";
import FlipCameraIcon from "../Icons/FlipCameraIcon";
import * as FileSystem from "expo-file-system";
import Icon from "../../../icons/Icon";
import { iconStyles } from "../../../styles/iconStyles";
import IconLarge from "../../../components/Icons/IconLarge";

export default function Footer({
  cameraRef,
  rotation,
  cameraType,
  flash,
  toggleFlash,
  toggleCameraFacing,
  handleZoomChange,
  footerHeight,
}) {
  const navigation = useNavigation();
  const { updateCurrentUser } = useAuth();
  const [createCameraShot] = useMutation(CREATE_CAMERA_SHOT);

  const handleTakePhoto = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        const file = await convertToFile(photo.uri, "photo.jpg");

        // Apply filter based on cameraType
        const filteredUri = await applyFilter(file.uri, cameraType);

        const filteredFile = await convertToFile(
          filteredUri,
          "filtered_photo.jpg"
        );

        const result = await createCameraShot({
          variables: {
            image: filteredFile,
          },
        });
        if (result.data.createCameraShot.success) {
          updateCurrentUser(result.data.createCameraShot.user);
        }
      } catch (error) {
        console.error("Error taking photo:", error);
      }
    }
  };

  const convertToFile = async (uri, filename) => {
    const file = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return {
      uri,
      name: filename,
      type: "image/jpeg",
    };
  };

  const navigateToCameraRoll = () => {
    navigation.navigate("CameraRoll");
  };
  const navigateToDevelopingRoll = () => {
    navigation.navigate("DevelopingRoll");
  };

  const [zoomLevel, setZoomLevel] = React.useState(1);

  const handleZoomPress = (zoom) => {
    setZoomLevel(zoom);
    handleZoomChange(zoom);
  };

  return (
    <View style={[styles.wrapper, { height: footerHeight }]}>
      <View style={styles.row}>
        <Pressable onPress={toggleFlash} style={styles.rowIcon}>
          {flash === "off" ? <FlashOutlineIcon /> : <FlashSolidIcon />}
        </Pressable>
        <View style={styles.zoomContainer}>
          <Pressable
            onPress={() => handleZoomPress(0.5)}
            style={[
              styles.zoomButton,
              zoomLevel === 0.5 && styles.activeZoomButton,
            ]}
          >
            <Text
              style={[
                styles.zoomText,
                zoomLevel === 0.5 && styles.activeZoomText,
              ]}
            >
              0.5x
            </Text>
          </Pressable>
          <Pressable
            onPress={() => handleZoomPress(1)}
            style={[
              styles.zoomButton,
              zoomLevel === 1 && styles.activeZoomButton,
            ]}
          >
            <Text
              style={[
                styles.zoomText,
                zoomLevel === 1 && styles.activeZoomText,
              ]}
            >
              1x
            </Text>
          </Pressable>
          <Pressable
            onPress={() => handleZoomPress(3)}
            style={[
              styles.zoomButton,
              zoomLevel === 3 && styles.activeZoomButton,
            ]}
          >
            <Text
              style={[
                styles.zoomText,
                zoomLevel === 3 && styles.activeZoomText,
              ]}
            >
              3x
            </Text>
          </Pressable>
        </View>
        <Pressable onPress={toggleCameraFacing} style={styles.rowIcon}>
          <FlipCameraIcon />
        </Pressable>
      </View>
      <View style={styles.container}>
        <Animated.View style={{ transform: [{ rotate: rotation }], zIndex: 1 }}>
          <Pressable
            onPress={navigateToCameraRoll}
            style={styles.iconContainer}
          >
            <IconLarge
              name="photo"
              style={iconStyles.photoGallery}
              tintColor="#fff"
              onPress={navigateToCameraRoll}
            />
          </Pressable>
        </Animated.View>
        <View style={styles.circleContainer}>
          <Pressable onPress={handleTakePhoto}>
            <LinearGradient
              colors={["#6AB952", "#5FC4ED"]}
              style={styles.circleOutline}
            >
              <View style={styles.circle} />
            </LinearGradient>
          </Pressable>
        </View>
        <Animated.View style={{ transform: [{ rotate: rotation }] }}>
          <Pressable
            onPress={navigateToDevelopingRoll}
            style={styles.iconContainer}
          >
            <IconLarge
              name="film"
              style={iconStyles.inDevelopment}
              tintColor="#fff"
              onPress={navigateToDevelopingRoll}
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
    marginBottom: 27,
    width: "70%",
  },
  zoomContainer: {
    flexDirection: "row",
    borderRadius: 25,
    paddingHorizontal: 8,
  },
  zoomButton: {
    padding: 10,
  },
  activeZoomButton: {
    backgroundColor: "#6AB95230",
    borderRadius: 25,
  },
  zoomText: {
    color: "#fff",
    fontSize: 12,
  },
  activeZoomText: {
    fontWeight: "bold",
  },
  rowIcon: {
    alignItems: "center",
    justifyContent: "center",
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
    justifyContent: "center",
    width: 75,
  },
  iconText: {
    color: "#fff",
    fontSize: 12,
    marginTop: 1,
  },
  circleContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  circleOutline: {
    width: 72,
    height: 72,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  circle: {
    width: 60,
    height: 60,
    borderRadius: 50,
    backgroundColor: "#ececec",
  },
});
