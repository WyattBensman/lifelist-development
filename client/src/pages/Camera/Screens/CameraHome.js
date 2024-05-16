import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet } from "react-native";
import { layoutStyles } from "../../../styles/LayoutStyles";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { useNavigationContext } from "../../../contexts/NavigationContext";
import { Camera } from "expo-camera";

export default function CameraHome() {
  const { setIsTabBarVisible } = useNavigationContext();
  const [hasPermission, setHasPermission] = useState(null);
  const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  useEffect(() => {
    setIsTabBarVisible(false);
    return () => setIsTabBarVisible(true);
  }, [setIsTabBarVisible]);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={layoutStyles.wrapper}>
      <Header flash={flash} setFlash={setFlash} type={type} setType={setType} />
      <Camera
        style={styles.camera}
        type={type}
        flashMode={flash}
        ref={cameraRef}
      >
        <View style={{ flex: 1 }} />
      </Camera>
      <Footer cameraRef={cameraRef} />
    </View>
  );
}

const styles = StyleSheet.create({
  camera: {
    flex: 1,
  },
});
