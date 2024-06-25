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
import IconLarge from "../../../components/Icons/IconLarge";
import { iconStyles } from "../../../styles/iconStyles";

export default function Footer({
  cameraRef,
  rotation,
  cameraType,
  flash,
  toggleFlash,
  toggleCameraFacing,
  handleZoomChange,
  footerHeight,
  disabled,
}) {
  const navigation = useNavigation();
  const { updateCurrentUser } = useAuth();
  const [createCameraShot] = useMutation(CREATE_CAMERA_SHOT);

  const handleTakePhoto = async () => {
    if (cameraRef.current && !disabled) {
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
            onPress={() => handleZoomPress(0.5)}
            style={[
              styles.zoomButton,
              zoomLevel === 0.5 && styles.activeZoomButton,
              disabled && styles.disabledButton,
            ]}
            disabled={disabled}
          >
            <Text
              style={[
                styles.zoomText,
                zoomLevel === 0.5 && styles.activeZoomText,
                disabled && styles.disabledText,
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
          <Pressable
            onPress={() => handleZoomPress(3)}
            style={[
              styles.zoomButton,
              zoomLevel === 3 && styles.activeZoomButton,
              disabled && styles.disabledButton,
            ]}
            disabled={disabled}
          >
            <Text
              style={[
                styles.zoomText,
                zoomLevel === 3 && styles.activeZoomText,
                disabled && styles.disabledText,
              ]}
            >
              3x
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
    marginBottom: 27,
    width: "70%",
  },
  disabled: {
    opacity: 0.5,
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
