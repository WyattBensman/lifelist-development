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
import { useMutation, useLazyQuery } from "@apollo/client";
import { CREATE_CAMERA_SHOT } from "../../../utils/mutations/cameraMutations";
import { GET_PRESIGNED_URL } from "../../../utils/queries";
import {
  saveMetaDataToCache,
  getMetaDataFromCache,
  saveToAsyncStorage,
  getFromAsyncStorage,
} from "../../../utils/cacheHelper";
import * as ImageManipulator from "expo-image-manipulator";
import { applyFilterToImage } from "../../../utils/cameraUtils/applyFilterToImage";
import { useDevelopingRoll } from "../../../contexts/DevelopingRollContext";

const screenWidth = Dimensions.get("window").width;
const cameraHeight = screenWidth * (3 / 2); // 3:2 aspect ratio

const MAX_SHOTS_PER_DAY = 10;

export default function CameraHome() {
  const { setIsTabBarVisible } = useNavigationContext();
  const {
    developingShots,
    addShotToDevelopingRoll,
    initializeDevelopingRollCache,
    isDevelopingRollCacheInitialized,
  } = useDevelopingRoll();

  const [showHeaderOptions, setShowHeaderOptions] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [shotsLeft, setShotsLeft] = useState(MAX_SHOTS_PER_DAY);

  // Load camera settings from cache
  const [facing, setFacing] = useState(
    () => getMetaDataFromCache("cameraFacing") || "back"
  );
  const [flash, setFlash] = useState(
    () => getMetaDataFromCache("cameraFlash") || "off"
  );

  const [zoom, setZoom] = useState(0);
  const cameraRef = useRef(null);
  const [createCameraShot] = useMutation(CREATE_CAMERA_SHOT);
  const [getPresignedUrl] = useLazyQuery(GET_PRESIGNED_URL);

  const rotateAnim = useRef(new Animated.Value(0)).current;
  const screenWidth = Dimensions.get("window").width;
  const cameraHeight = (screenWidth * 3) / 2;

  const calculateTodayShots = () => {
    const today = new Date().toISOString().split("T")[0];
    return developingShots.filter(
      (shot) => new Date(shot.capturedAt).toISOString().split("T")[0] === today
    ).length;
  };

  useEffect(() => {
    const loadCacheAndCalculateShots = async () => {
      if (!isDevelopingRollCacheInitialized) {
        await initializeDevelopingRollCache();
      }
      const todayShots = calculateTodayShots();

      setShotsLeft(MAX_SHOTS_PER_DAY - todayShots);
    };

    loadCacheAndCalculateShots();
  }, [isDevelopingRollCacheInitialized, developingShots]);

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

  // Reset shots at midnight
  const resetShotsAtMidnight = async () => {
    const now = new Date();
    const today = now.toISOString().split("T")[0]; // Get today's date (YYYY-MM-DD)
    const storedDate = await getFromAsyncStorage("shotsLastResetDate");

    if (storedDate !== today) {
      // If the stored date is different, reset the shot count
      await saveToAsyncStorage("shotsLeft", MAX_SHOTS_PER_DAY);
      await saveToAsyncStorage("shotsLastResetDate", today);
      setShotsLeft(MAX_SHOTS_PER_DAY);
    } else {
      // Load the shots left from the cache
      const developingShots = await getFromAsyncStorage("shotsLeft");
      if (developingShots !== null) {
        setShotsLeft(developingShots);
      }
    }
  };

  useEffect(() => {
    resetShotsAtMidnight();
  }, []);

  useEffect(() => {
    setIsTabBarVisible(false);
    return () => setIsTabBarVisible(true);
  }, []);

  useEffect(() => {
    Animated.timing(rotateAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  // Initialize DevelopingRollContext Cache
  useEffect(() => {
    if (!isDevelopingRollCacheInitialized) {
      initializeDevelopingRollCache();
    }
  }, [isDevelopingRollCacheInitialized]);

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
    setFacing((prevFacing) => {
      const newFacing = prevFacing === "front" ? "back" : "front";
      saveMetaDataToCache("cameraFacing", newFacing, 0);
      return newFacing;
    });
  };

  const toggleFlash = () => {
    const newFlash = flash === "off" ? "on" : "off";
    setFlash(newFlash);
    saveMetaDataToCache("cameraFlash", newFlash, 0);
  };

  const handleZoomChange = (zoomLevel) => {
    setZoom(zoomLevel);
  };

  const handleToggleHeaderOptions = () => {
    setShowHeaderOptions((prev) => !prev);
  };

  const handleSelectCameraType = (type) => {
    setCameraType(type);
    saveToAsyncStorage("cameraType", type);
  };

  const handleTakePhoto = async () => {
    if (shotsLeft <= 0) {
      alert("No shots left for today!");
      return;
    }

    // Initialize cache if not already done
    if (!isDevelopingRollCacheInitialized) {
      await initializeDevelopingRollCache();
    }

    if (cameraRef.current) {
      const newShotsLeft = shotsLeft - 1;
      setShotsLeft(newShotsLeft);

      try {
        // Capture the photo
        const photo = await cameraRef.current.takePictureAsync({
          quality: 1, // Capture at max quality
        });

        // Resize and compress the original image
        const resizedUri = await resizeOriginalImage(photo.uri);

        // Generate a smaller thumbnail
        const thumbnailUri = await generateThumbnail(photo.uri);

        // Upload the resized image and thumbnail
        const newShot = await handleUploadPhoto(resizedUri, thumbnailUri);

        addShotToDevelopingRoll(newShot);

        saveToAsyncStorage("cameraShotsLeft", newShotsLeft);
      } catch (error) {
        setShotsLeft((prev) => prev + 1);
        alert("Error taking photo. Please try again.");
        console.error("Error taking photo:", error);
      }
    }
  };

  const uriToFile = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const fileName = `photo_${Date.now()}.jpg`;
    return new File([blob], fileName, { type: blob.type });
  };

  const resizeOriginalImage = async (imageUri) => {
    try {
      const result = await ImageManipulator.manipulateAsync(
        imageUri,
        [{ resize: { width: 1280, height: 1920 } }], // Resize image, maintain aspect ratio
        { compress: 1, format: ImageManipulator.SaveFormat.JPEG } // Compression
      );

      return result.uri; // Return the resized image URI
    } catch (error) {
      console.error("Error resizing original image:", error);
      throw error;
    }
  };

  const generateThumbnail = async (imageUri) => {
    try {
      const result = await ImageManipulator.manipulateAsync(
        imageUri,
        [{ resize: { width: 400, height: 600 } }],
        { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
      );

      return result.uri;
    } catch (error) {
      console.error("Error generating thumbnail:", error);
      throw error;
    }
  };

  const uploadImageToS3 = async (fileUri, presignedUrl) => {
    const response = await fetch(fileUri);
    const blob = await response.blob();
    await fetch(presignedUrl, {
      method: "PUT",
      headers: {
        "Content-Type": blob.type,
      },
      body: blob,
    });
  };

  const handleUploadPhoto = async (originalUri, thumbnailUri) => {
    try {
      const originalFile = await uriToFile(originalUri);
      const thumbnailFile = await uriToFile(thumbnailUri);

      // Fetch presigned URLs for both original and thumbnail images
      const originalPresigned = await getPresignedUrl({
        variables: {
          folder: "camera-images",
          fileName: originalFile.name,
          fileType: originalFile.type,
        },
      });

      const thumbnailPresigned = await getPresignedUrl({
        variables: {
          folder: "camera-images",
          fileName: thumbnailFile.name,
          fileType: thumbnailFile.type,
        },
      });

      // Upload the images to S3
      await uploadImageToS3(
        originalUri,
        originalPresigned.data.getPresignedUrl.presignedUrl
      );
      await uploadImageToS3(
        thumbnailUri,
        thumbnailPresigned.data.getPresignedUrl.presignedUrl
      );

      // Create the camera shot in the backend
      const result = await createCameraShot({
        variables: {
          image: originalPresigned.data.getPresignedUrl.fileUrl,
          thumbnail: thumbnailPresigned.data.getPresignedUrl.fileUrl,
        },
      });

      // Validate the response
      if (result.data.createCameraShot.success) {
        return result.data.createCameraShot.cameraShot; // Return the new shot details
      } else {
        throw new Error(result.data.createCameraShot.message);
      }
    } catch (error) {
      console.error("Error uploading photo:", error);
      throw error; // Propagate the error to the caller
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
        <CameraView
          ref={cameraRef}
          style={{ height: cameraHeight, width: screenWidth }}
          facing={facing}
        />
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
