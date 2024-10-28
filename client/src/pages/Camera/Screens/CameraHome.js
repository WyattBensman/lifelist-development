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
import {
  saveToCacheStore,
  getFromCacheStore,
  saveToAsyncStorage,
  getFromAsyncStorage,
} from "../../../utils/cacheHelper";
import { GET_DAILY_CAMERA_SHOTS_LEFT } from "../../../utils/queries"; // Import query

export default function CameraHome() {
  const { setIsTabBarVisible } = useNavigationContext();
  const [showHeaderOptions, setShowHeaderOptions] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  // Load camera settings from cache
  const [facing, setFacing] = useState(
    () => getFromCacheStore("cameraFacing") || "back"
  );
  const [flash, setFlash] = useState(
    () => getFromCacheStore("cameraFlash") || "off"
  );

  const [zoom, setZoom] = useState(0);
  const [capturedImage, setCapturedImage] = useState(null); // Captured photo
  const [filteredUri, setFilteredUri] = useState(null);
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
    nextMidnight.setDate(now.getDate() + 1);

    return (nextMidnight - now) / 1000; // Time until midnight in seconds
  };

  const [cameraType, setCameraType] = useState("Standard");

  useEffect(() => {
    const loadCameraType = async () => {
      const storedCameraType = await getFromAsyncStorage("cameraType");
      if (storedCameraType) {
        setCameraType(storedCameraType);
      }
    };

    loadCameraType();
  }, []);

  // Load cameraType from AsyncStorage
  /* const [cameraType, setCameraType] = useState(async () => {
    const storedCameraType = await getFromAsyncStorage("cameraType");
    return storedCameraType || "Standard";
  }); */

  const [filter, setFilter] = useState("standardFilter");

  // Fetch camera shots left and cache it
  const fetchCameraShotsLeft = async () => {
    const cachedShots = getFromCacheStore("cameraShotsLeft");
    if (cachedShots !== null) {
      setShotsLeft(cachedShots);
    } else {
      const response = await client.query({
        query: GET_DAILY_CAMERA_SHOTS_LEFT,
      });
      const shots = response.data.getDailyCameraShotsLeft;
      setShotsLeft(shots);
      const ttl = getTTLForMidnight();
      saveToCacheStore("cameraShotsLeft", shots, ttl); // Cache shotsLeft until midnight
    }
  };

  useEffect(() => {
    setIsTabBarVisible(false);
    fetchCameraShotsLeft();
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
    saveToCacheStore("cameraFacing", newFacing, 0); // No expiration, store the facing state
  };

  // Toggle flash state and cache the state
  const toggleFlash = () => {
    const newFlash = flash === "off" ? "on" : "off";
    setFlash(newFlash);
    saveToCacheStore("cameraFlash", newFlash, 0); // No expiration, store the flash state
  };

  const handleZoomChange = (zoomLevel) => {
    setZoom(zoomLevel);
  };

  const handleToggleHeaderOptions = () => {
    setShowHeaderOptions((prev) => !prev);
  };

  const handleSelectCameraType = (type) => {
    setCameraType(type);
    setFilter(type === "Standard" ? "standardFilter" : "fujiFilter");
    saveToAsyncStorage("cameraType", type); // Persist camera type in AsyncStorage
  };

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
        setCapturedImage(photo.uri);
        await applyFilter(photo.uri);

        const ttl = getTTLForMidnight();
        saveToCacheStore("cameraShotsLeft", newShotsLeft, ttl); // Update shots left in cache
      } catch (error) {
        setShotsLeft(shotsLeft); // Revert shots left if error occurs
        alert("Error taking photo. Please try again.");
        console.error("Error taking photo:", error);
      }
    }
  };

  // Utility function to convert URI to File object
  const uriToFile = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob(); // Convert URI to Blob

    // Extract the file extension from the MIME type (e.g., 'image/jpeg' becomes 'jpeg')
    const fileExtension = blob.type.split("/")[1];
    const fileName = `filtered_image.${fileExtension}`; // Dynamic filename based on MIME type

    const file = new File([blob], fileName, { type: blob.type }); // Create File object
    console.log(`FILE: ${file}`);

    return file;
  };

  // Handle file upload to GraphQL server
  const handleUploadPhoto = async (imageUri) => {
    try {
      // Convert the image URI into a file that can be uploaded
      const imageFile = await uriToFile(imageUri);

      // Log file information on the frontend
      console.log("File Name (Frontend):", imageFile.name);
      console.log("MIME Type (Frontend):", imageFile.type);
      console.log("File Size (Frontend):", imageFile.size);

      // Execute the mutation to upload the file
      const { data: result } = await createCameraShot({
        variables: { image: imageFile },
      });

      if (result.createCameraShot.success) {
        console.log("Image uploaded successfully!");
      } else {
        console.error("Upload failed:", result.createCameraShot.message);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  return (
    <View style={layoutStyles.wrapper}>
      <Header
        shotsLeft={shotsLeft}
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
