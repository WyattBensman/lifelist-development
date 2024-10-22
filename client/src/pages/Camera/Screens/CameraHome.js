import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
  Text,
  Button,
} from "react-native";
import { layoutStyles } from "../../../styles/LayoutStyles";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useNavigationContext } from "../../../contexts/NavigationContext";
import { useMutation } from "@apollo/client";
import { CREATE_CAMERA_SHOT } from "../../../utils/mutations/cameraMutations";
import { applyFilterToImage } from "../../../utils/cameraUtils/applyFilterToImage";
import { setCache, getCache } from "../../../utils/cacheHelper";
import { GET_DAILY_CAMERA_SHOTS_LEFT } from "../../../utils/queries"; // Import query

export default function CameraHome() {
  const { setIsTabBarVisible } = useNavigationContext();
  const [showHeaderOptions, setShowHeaderOptions] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState("back");
  const [flash, setFlash] = useState("off");
  const [zoom, setZoom] = useState(0);
  const [capturedImage, setCapturedImage] = useState(null); // Captured photo
  const [filteredUri, setFilteredUri] = useState(null); // Filtered image
  const [shotsLeft, setShotsLeft] = useState(10); // Store shots left
  const cameraRef = useRef(null);
  const [createCameraShot] = useMutation(CREATE_CAMERA_SHOT);

  const rotateAnim = useRef(new Animated.Value(0)).current;
  const screenWidth = Dimensions.get("window").width;
  const cameraHeight = (screenWidth * 3) / 2;

  // Get the time until 4 AM tomorrow
  const getTTLFor4AM = () => {
    const now = new Date();
    const next4AM = new Date();
    next4AM.setHours(4, 0, 0, 0);

    if (now.getHours() >= 4) {
      next4AM.setDate(now.getDate() + 1); // If it's after 4AM, set to next day
    }

    return (next4AM - now) / 1000; // Time until 4AM in seconds
  };

  // Load cached filter, default to "Standard"
  const [cameraType, setCameraType] = useState(
    () => getCache("cameraFilter") || "Standard"
  );

  const [filter, setFilter] = useState(() => {
    const cachedFilter = getCache("cameraFilter");

    return cachedFilter === "Standard"
      ? "standardFilter"
      : cachedFilter === "Fuji"
      ? "fujiFilter"
      : "standardFilter"; // Default is "Standard"
  });

  // Fetch camera shots left and cache it
  const fetchCameraShotsLeft = async () => {
    const cachedShots = getCache("cameraShotsLeft");
    if (cachedShots !== null) {
      setShotsLeft(cachedShots); // Use cached value if it exists
    } else {
      // Query the server for fresh data
      const response = await client.query({
        query: GET_DAILY_CAMERA_SHOTS_LEFT,
      });
      const shots = response.data.getDailyCameraShotsLeft;
      setShotsLeft(shots); // Set state with fresh data

      // Cache the shots left until 4 AM
      const ttl = getTTLFor4AM();
      setCache("cameraShotsLeft", shots, ttl);
    }
  };

  useEffect(() => {
    setIsTabBarVisible(false);
    fetchCameraShotsLeft(); // Fetch camera shots left when component loads
    return () => setIsTabBarVisible(true);
  }, []);

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
    setFilter(
      type === "Standard"
        ? "standardFilter"
        : type === "Disposable"
        ? "disposableFilter"
        : "fujiFilter"
    );

    setCache("cameraFilter", type, 0); // No expiration, store the selected filter
  };

  // Capture the photo and update shots left
  const handleTakePhoto = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({ quality: 1 });

      setCapturedImage(photo.uri); // Store captured image URI
      applyFilter(photo.uri); // Apply filter based on selected cameraType

      // Decrement shots left after taking a photo
      const newShotsLeft = shotsLeft - 1;
      setShotsLeft(newShotsLeft);
      setCache("cameraShotsLeft", newShotsLeft, getTTLFor4AM()); // Update cache
    }
  };

  // Apply filter using the utility function and upload the result
  const applyFilter = async (imageUri) => {
    try {
      const filteredImageUri = await applyFilterToImage(imageUri, filter); // Apply correct filter
      setFilteredUri(filteredImageUri); // Store filtered image URI
      handleUploadPhoto(filteredImageUri); // Upload filtered image
    } catch (error) {
      console.error("Error applying filter:", error);
    }
  };

  return (
    <View style={layoutStyles.wrapper}>
      <Header
        shotsLeft={shotsLeft} // Pass shots left to header
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
        </View>
        <Footer
          cameraRef={cameraRef}
          rotation={rotation}
          cameraType={cameraType}
          flash={flash}
          toggleFlash={toggleFlash}
          toggleCameraFacing={toggleCameraFacing}
          handleZoomChange={handleZoomChange}
          handleTakePhoto={handleTakePhoto} // Take photo and decrement shots left
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
