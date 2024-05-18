import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { useMutation } from "@apollo/client";
import { LinearGradient } from "expo-linear-gradient";
import CameraGalleryIcon from "../Icons/CameraGalleryIcon";
import DevelopingGalleryIcon from "../Icons/DevelopingGalleryIcon";
import { useNavigation } from "@react-navigation/native";
import { CREATE_CAMERA_SHOT } from "../../../utils/mutations/cameraMutations";
import { useAuth } from "../../../contexts/AuthContext";
import SymbolButton from "../../../icons/SymbolButton";

export default function Footer({
  cameraRef,
  shotOrientation,
  rotation,
  cameraType,
}) {
  const navigation = useNavigation();
  const { updateCurrentUser } = useAuth();
  const [createCameraShot] = useMutation(CREATE_CAMERA_SHOT);

  const handleTakePhoto = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        const result = await createCameraShot({
          variables: {
            image: photo.uri,
            camera: cameraType,
            shotOrientation,
          },
        });
        if (result.data.createCameraShot.success) {
          console.log("Photo taken and saved successfully");
          updateCurrentUser(result.data.createCameraShot.user);
        } else {
          console.log("Failed to save photo");
        }
      } catch (error) {
        console.error("Error taking photo:", error);
      }
    }
  };

  const navigateToCameraRoll = () => {
    navigation.navigate("CameraRoll");
  };
  const navigateToDevelopingRoll = () => {
    navigation.navigate("DevelopingRoll");
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.circleBackground} />
      <View style={styles.container}>
        <Animated.View style={{ transform: [{ rotate: rotation }], zIndex: 1 }}>
          <Pressable
            onPress={navigateToCameraRoll}
            style={styles.iconContainer}
          >
            <SymbolButton
              name="photo.stack"
              tintColor="#ffffff"
              onPress={navigateToCameraRoll}
            />
            <Text style={styles.iconText}>Gallery</Text>
          </Pressable>
        </Animated.View>
        <View style={styles.circleContainer}>
          <Pressable onPress={handleTakePhoto}>
            <LinearGradient
              colors={["#6AB952", "#5FC4ED"]}
              style={styles.circleOutline}
            >
              <View style={styles.circle} />
            </LinearGradient>
          </Pressable>
        </View>
        <Animated.View style={{ transform: [{ rotate: rotation }] }}>
          <Pressable
            onPress={navigateToDevelopingRoll}
            style={styles.iconContainer}
          >
            <SymbolButton
              name="film.stack"
              tintColor="#ffffff"
              onPress={navigateToDevelopingRoll}
            />
            <Text style={styles.iconText}>Developing</Text>
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
    backgroundColor: "#262828",
  },
  circleBackground: {
    position: "absolute",
    bottom: 19,
    width: 100,
    height: 100,
    borderRadius: 200,
    backgroundColor: "#262828",
  },
  container: {
    height: 100,
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
    height: 75,
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
    marginTop: -45,
  },
  circleOutline: {
    width: 72,
    height: 72,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  circle: {
    width: 60,
    height: 60,
    borderRadius: 50,
    backgroundColor: "#d4d4d4",
  },
});
