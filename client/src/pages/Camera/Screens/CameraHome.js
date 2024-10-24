import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Animated,
  Dimensions,
  Text,
  Button,
  StyleSheet,
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

  // Load cached camera settings, default to back and off for facing and flash respectively
  const [facing, setFacing] = useState(
    () => getCache("cameraFacing") || "back"
  );
  const [flash, setFlash] = useState(() => getCache("cameraFlash") || "off");

  const [zoom, setZoom] = useState(0);
  const [capturedImage, setCapturedImage] = useState(null); // Captured photo
  const [filteredUri, setFilteredUri] = useState(null); // Filtered image
  const [shotsLeft, setShotsLeft] = useState(10); // Store shots left
  const cameraRef = useRef(null);
  const [createCameraShot] = useMutation(CREATE_CAMERA_SHOT);

  const rotateAnim = useRef(new Animated.Value(0)).current;
  const screenWidth = Dimensions.get("window").width;
  const cameraHeight = (screenWidth * 3) / 2;

  // Get the time until midnight
  const getTTLForMidnight = () => {
    const now = new Date();
    const nextMidnight = new Date();
    nextMidnight.setHours(0, 0, 0, 0);
    nextMidnight.setDate(now.getDate() + 1); // Set to the next day at midnight

    return (nextMidnight - now) / 1000; // Time until midnight in seconds
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
      setShotsLeft(shots);

      // Cache the shots left until midnight
      const ttl = getTTLForMidnight();
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

  // Toggle between front and back camera and cache the state
  const toggleCameraFacing = () => {
    const newFacing = facing === "back" ? "front" : "back";
    setFacing(newFacing);
    setCache("cameraFacing", newFacing, 0); // No expiration, store the selected facing
  };

  // Toggle flash state and cache the state
  const toggleFlash = () => {
    const newFlash = flash === "off" ? "on" : "off";
    setFlash(newFlash);
    setCache("cameraFlash", newFlash, 0); // No expiration, store the flash state
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
    if (shotsLeft <= 0) {
      alert("No shots left for today!");
      return;
    }

    if (cameraRef.current) {
      const newShotsLeft = shotsLeft - 1;
      setShotsLeft(newShotsLeft);

      try {
        const photo = await cameraRef.current.takePictureAsync({ quality: 1 });

        setCapturedImage(photo.uri); // Store captured image URI
        await applyFilter(photo.uri); // Apply filter based on selected cameraType

        // Cache the updated shots left with midnight TTL
        setCache("cameraShotsLeft", newShotsLeft, getTTLForMidnight());
      } catch (error) {
        // If something goes wrong, revert the shots left update
        setShotsLeft(shotsLeft); // Revert if error
        alert("Error taking photo. Please try again.");
        console.error("Error taking photo:", error);
      }
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
