import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, Text, Button, Animated } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { layoutStyles } from "../../../styles/LayoutStyles";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { useNavigationContext } from "../../../contexts/NavigationContext";

export default function CameraHome() {
  const { setIsTabBarVisible } = useNavigationContext();
  const [facing, setFacing] = useState("back");
  const [flash, setFlash] = useState("off");
  const [shotOrientation, setShotOrientation] = useState("VERTICAL");
  const [cameraType, setCameraType] = useState("Disposable");
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);

  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setIsTabBarVisible(false);
    return () => setIsTabBarVisible(true);
  }, [setIsTabBarVisible]);

  useEffect(() => {
    Animated.timing(rotateAnim, {
      toValue: shotOrientation === "VERTICAL" ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [shotOrientation]);

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

  const toggleShotOrientation = () => {
    setShotOrientation((current) =>
      current === "VERTICAL" ? "HORIZONTAL" : "VERTICAL"
    );
  };

  const handleSelectCameraType = (type) => {
    setCameraType(type);
  };

  return (
    <View style={layoutStyles.wrapper}>
      <Header
        toggleFlash={toggleFlash}
        flash={flash}
        toggleShotOrientation={toggleShotOrientation}
        shotOrientation={shotOrientation}
        toggleCameraFacing={toggleCameraFacing}
        rotation={rotation}
        cameraType={cameraType}
        onSelectCameraType={handleSelectCameraType}
      />
      <View style={{ flex: 1 }}>
        <CameraView
          ref={cameraRef}
          style={{ flex: 1 }}
          facing={facing}
          flash={flash}
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
        shotOrientation={shotOrientation}
        rotation={rotation}
        cameraType={cameraType}
      />
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
