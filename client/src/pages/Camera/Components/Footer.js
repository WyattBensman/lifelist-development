import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import CameraGalleryIcon from "../Icons/CameraGalleryIcon";
import DevelopingGalleryIcon from "../Icons/DevelopingGalleryIcon";
import { useNavigation } from "@react-navigation/native";
import { useMutation } from "@apollo/client";
import { CREATE_CAMERA_SHOT } from "../../../utils/mutations/cameraMutations";

export default function Footer({ cameraRef }) {
  const navigation = useNavigation();
  const [createCameraShot] = useMutation(CREATE_CAMERA_SHOT);

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      createCameraShot({
        variables: {
          image: photo.uri,
          camera: "STANDARD", // You can customize this as per your requirement
          shotOrientation:
            photo.width > photo.height ? "HORIZONTAL" : "VERTICAL",
        },
      });
    }
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.circleBackground} />
      <View style={styles.container}>
        <Pressable
          onPress={() => navigation.navigate("CameraRoll")}
          style={[styles.iconContainer, { marginTop: 1, zIndex: 1 }]}
        >
          <CameraGalleryIcon />
          <Text style={[styles.iconText, { marginTop: 2 }]}>Camera Roll</Text>
        </Pressable>
        <Pressable onPress={takePicture} style={styles.circleContainer}>
          <View style={styles.circleOutline}>
            <View style={styles.circle} />
          </View>
        </Pressable>
        <Pressable
          onPress={() => navigation.navigate("DevelopingRoll")}
          style={styles.iconContainer}
        >
          <DevelopingGalleryIcon />
          <Text style={styles.iconText}>Developing</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
    alignItems: "center",
    backgroundColor: "#262828",
  },
  circleBackground: {
    position: "absolute",
    bottom: 7,
    width: 100,
    height: 100,
    borderRadius: 200,
    backgroundColor: "#262828",
  },
  container: {
    height: 90,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    zIndex: 1,
    width: "100%",
  },
  iconContainer: {
    alignItems: "center",
  },
  iconText: {
    color: "#fff",
    fontSize: 12,
  },
  circleContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -45,
  },
  circleOutline: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    borderWidth: 3,
    borderColor: "#6AB952",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#262828",
  },
  circle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#d4d4d4",
  },
});
