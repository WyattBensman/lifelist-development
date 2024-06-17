// src/pages/CameraHome.js
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Text,
  Button,
  Animated,
  Dimensions,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { filters } from "../../../utils/shaders";
import { layoutStyles } from "../../../styles/LayoutStyles";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { useNavigationContext } from "../../../contexts/NavigationContext";
import { useNavigation } from "@react-navigation/native";

export default function CameraHome() {
  const navigation = useNavigation();
  const { setIsTabBarVisible } = useNavigationContext();
  const [facing, setFacing] = useState("back");
  const [flash, setFlash] = useState("off");
  const [cameraType, setCameraType] = useState("Disposable");
  const [zoom, setZoom] = useState(1);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);
  const [filter, setFilter] = useState(null);

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
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  const toggleFlash = () => {
    setFlash((current) => (current === "off" ? "on" : "off"));
  };

  const handleSelectCameraType = (type) => {
    setCameraType(type);
    if (type === "Analog") {
      setFilter(filters.analogFilm);
    } else if (type === "Disposable") {
      setFilter(filters.disposableFilm);
    } else {
      setFilter(null);
    }
  };

  const handleZoomChange = (zoomLevel) => {
    setZoom(zoomLevel);
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
          footerHeight={Dimensions.get("window").height - cameraHeight}
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
    position: "absolute",
    top: 0,
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 1,
    borderWidth: 1,
    borderColor: "red", // Added border color for visibility
  },
});
