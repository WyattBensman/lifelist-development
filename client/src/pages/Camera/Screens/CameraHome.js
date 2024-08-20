import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
  Alert,
  Text,
  Button,
} from "react-native";
import { layoutStyles } from "../../../styles/LayoutStyles";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useNavigationContext } from "../../../contexts/NavigationContext";
import { useNavigation } from "@react-navigation/native";
import { useMutation } from "@apollo/client";
import { applyFilter } from "../../../utils/cameraUtils/applyFilter";
import { CREATE_CAMERA_SHOT } from "../../../utils/mutations/cameraMutations";

export default function CameraHome() {
  const navigation = useNavigation();
  const { setIsTabBarVisible } = useNavigationContext();
  const [facing, setFacing] = useState("back");
  const [flash, setFlash] = useState("off");
  const [cameraType, setCameraType] = useState("Disposable");
  const [zoom, setZoom] = useState(0);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);
  const [filter, setFilter] = useState("disposableFilter");
  const [showHeaderOptions, setShowHeaderOptions] = useState(false);
  const [createCameraShot] = useMutation(CREATE_CAMERA_SHOT);

  const rotateAnim = useRef(new Animated.Value(0)).current;
  const screenWidth = Dimensions.get("window").width;
  const cameraHeight = (screenWidth * 3) / 2;

  useEffect(() => {
    setIsTabBarVisible(false);
    return () => setIsTabBarVisible(true);
  }, [setIsTabBarVisible]);

  useEffect(() => {
    Animated.timing(rotateAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "90deg"],
  });

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  const toggleCameraFacing = () => {
    setFacing(facing === "back" ? "front" : "back");
  };

  const toggleFlash = () => {
    setFlash(flash === "off" ? "on" : "off");
  };

  const handleZoomChange = (zoomLevel) => {
    setZoom(zoomLevel);
  };

  const handleToggleHeaderOptions = () => {
    setShowHeaderOptions((prev) => !prev);
  };

  const handleSelectCameraType = (type) => {
    setCameraType(type);

    switch (type) {
      case "Standard":
        setFilter("standardFilter");
        break;
      case "Disposable":
        setFilter("disposableFilter");
        break;
      case "Fuji":
        setFilter("fujiFilter");
        break;
      default:
        setFilter("standardFilter");
        break;
    }
  };

  const handleTakePhoto = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          base64: true,
          quality: 1,
          exif: true,
          skipProcessing: true,
        });

        const filterOutputUri = await applyFilter(photo.uri, cameraType);

        const { data } = await createCameraShot({
          variables: {
            image: {
              uri: filterOutputUri,
              type: "image/jpeg",
              name: "photo.jpg",
            },
          },
        });

        if (data.createCameraShot.success) {
          Alert.alert(
            "Success",
            data.createCameraShot.message || "Photo added to developing shots!",
            [{ text: "OK" }]
          );
        } else {
          throw new Error(
            data.createCameraShot.message || "Failed to add photo."
          );
        }
      } catch (error) {
        console.error("Error taking photo:", error);
        Alert.alert(
          "Error",
          error.message || "There was an error while taking the photo.",
          [{ text: "OK" }]
        );
      }
    }
  };

  return (
    <View style={layoutStyles.wrapper}>
      <Header
        toggleFlash={toggleFlash}
        flash={flash}
        toggleCameraFacing={toggleCameraFacing}
        rotation={rotation}
        cameraType={cameraType}
        onSelectCameraType={handleSelectCameraType}
        showOptions={showHeaderOptions}
        onToggleOptions={handleToggleHeaderOptions}
      />
      <View style={{ flex: 1 }}>
        <View style={{ height: cameraHeight, width: screenWidth }}>
          <CameraView
            ref={cameraRef}
            style={{ height: "100%", width: "100%" }}
            facing={facing}
            flash={flash}
            zoom={zoom}
          />
          <View style={styles.overlay}>
            <View style={styles.cornerTopLeft} />
            <View style={styles.cornerTopRight} />
            <View style={styles.cornerBottomLeft} />
            <View style={styles.cornerBottomRight} />
            <View style={styles.centerCrosshair}>
              <View style={styles.crosshairVertical} />
              <View style={styles.crosshairHorizontal} />
            </View>
            <View style={styles.innerCornerTopLeft} />
            <View style={styles.innerCornerTopRight} />
            <View style={styles.innerCornerBottomLeft} />
            <View style={styles.innerCornerBottomRight} />
          </View>
        </View>
        <Footer
          cameraRef={cameraRef}
          rotation={rotation}
          cameraType={cameraType}
          flash={flash}
          toggleFlash={toggleFlash}
          toggleCameraFacing={toggleCameraFacing}
          handleZoomChange={handleZoomChange}
          footerHeight={Dimensions.get("window").height - cameraHeight}
          disabled={showHeaderOptions}
          filter={filter}
          handleTakePhoto={handleTakePhoto}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 1,
  },
  cornerTopLeft: {
    position: "absolute",
    top: 20,
    left: 20,
    width: 40,
    height: 40,
    borderLeftWidth: 2,
    borderTopWidth: 2,
    borderColor: "rgba(236, 236, 236, 0.15)",
  },
  cornerTopRight: {
    position: "absolute",
    top: 20,
    right: 20,
    width: 40,
    height: 40,
    borderRightWidth: 2,
    borderTopWidth: 2,
    borderColor: "rgba(236, 236, 236, 0.15)",
  },
  cornerBottomLeft: {
    position: "absolute",
    bottom: 20,
    left: 20,
    width: 40,
    height: 40,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderColor: "rgba(236, 236, 236, 0.15)",
  },
  cornerBottomRight: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 40,
    height: 40,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderColor: "rgba(236, 236, 236, 0.15)",
  },
  centerCrosshair: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -20 }, { translateY: -20 }],
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  crosshairVertical: {
    position: "absolute",
    width: 2,
    height: 20,
    backgroundColor: "rgba(236, 236, 236, 0.15)",
  },
  crosshairHorizontal: {
    position: "absolute",
    height: 2,
    width: 20,
    backgroundColor: "rgba(236, 236, 236, 0.15)",
  },
  innerCornerTopLeft: {
    position: "absolute",
    top: "45%",
    left: "45%",
    width: 20,
    height: 20,
    borderLeftWidth: 2,
    borderTopWidth: 2,
    borderColor: "rgba(236, 236, 236, 0.15)",
    transform: [{ translateX: -25 }, { translateY: -10 }],
  },
  innerCornerTopRight: {
    position: "absolute",
    top: "45%",
    right: "45%",
    width: 20,
    height: 20,
    borderRightWidth: 2,
    borderTopWidth: 2,
    borderColor: "rgba(236, 236, 236, 0.15)",
    transform: [{ translateX: 25 }, { translateY: -10 }],
  },
  innerCornerBottomLeft: {
    position: "absolute",
    bottom: "45%",
    left: "45%",
    width: 20,
    height: 20,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderColor: "rgba(236, 236, 236, 0.15)",
    transform: [{ translateX: -25 }, { translateY: 10 }],
  },
  innerCornerBottomRight: {
    position: "absolute",
    bottom: "45%",
    right: "45%",
    width: 20,
    height: 20,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderColor: "rgba(236, 236, 236, 0.15)",
    transform: [{ translateX: 25 }, { translateY: 10 }],
  },
});
