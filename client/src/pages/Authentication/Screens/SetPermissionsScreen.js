import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  Pressable,
  Image,
  Alert,
  Linking,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useCameraPermissions } from "expo-camera";
import ButtonSolid from "../../../components/Buttons/ButtonSolid";
import HeaderStack from "../../../components/Headers/HeaderStack";
import Icon from "../../../components/Icons/Icon";
import { layoutStyles, iconStyles } from "../../../styles";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SetPermissionsScreen() {
  const [cameraPermission, requestCameraPermission, getCameraPermission] =
    useCameraPermissions();
  const [cameraPermissionLocked, setCameraPermissionLocked] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [permissionsChecked, setPermissionsChecked] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    if (!permissionsChecked) {
      checkPermissions();
    }
  }, [permissionsChecked]);

  // Function to check camera permissions
  const checkPermissions = async () => {
    try {
      const cameraStatus = await getCameraPermission();
      const cameraGranted = cameraStatus.status === "granted";

      setCameraPermissionLocked(cameraGranted);
      setIsValid(cameraGranted);

      setPermissionsChecked(true);
    } catch (error) {
      console.error("Error checking permissions: ", error);
    }
  };

  const requestCameraPermissionHandler = async () => {
    try {
      const { status, canAskAgain } = await requestCameraPermission();
      if (status === "granted") {
        setCameraPermissionLocked(true);
        setIsValid(true);
      } else if (status === "denied" && !canAskAgain) {
        setCameraPermissionLocked(true);
        showSettingsAlert("Camera");
      }
    } catch (error) {
      console.error("Error requesting camera permission:", error);
    }
  };

  const showSettingsAlert = (permissionType) => {
    Alert.alert(
      `${permissionType} Permission Required`,
      `Access to ${permissionType.toLowerCase()} has been permanently denied. Please go to your phone's settings to enable it.`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Open Settings",
          onPress: () => Linking.openSettings(),
        },
      ]
    );
  };

  const handleNextStep = async () => {
    if (isValid) {
      try {
        await AsyncStorage.setItem("registrationProgress", "ShareEarlyAccess");
        navigation.navigate("ShareEarlyAccess");
      } catch (error) {
        console.error("Error saving registration progress:", error);
      }
    } else {
      Alert.alert(
        "Permissions Required",
        "Camera permission is required to proceed."
      );
    }
  };

  return (
    <View style={layoutStyles.wrapper}>
      <HeaderStack
        arrow={
          <Icon
            name="chevron.backward"
            onPress={() => navigation.goBack()}
            style={iconStyles.backArrow}
            weight="semibold"
          />
        }
        button1={
          <Icon
            name="chevron.forward"
            weight="heavy"
            tintColor={isValid ? "#6AB952" : "#696969"} // Green if valid, gray if not
            style={iconStyles.backArrow}
            onPress={isValid ? handleNextStep : null} // Only navigate if permissions are valid
          />
        }
        hasBorder={false}
      />
      <View style={{ justifyContent: "space-between", flex: 1 }}>
        {/* Top Container */}
        <View style={styles.topContainer}>
          <Text style={styles.stepIndicator}>4 of 4 Steps</Text>
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarFilled} />
            <View style={styles.progressBarEmpty} />
          </View>
        </View>

        {/* Middle Container */}
        <View style={styles.middleContainer}>
          <Text style={styles.stepTitle}>Step 3</Text>
          <Text style={styles.mainTitle}>Don't forget your Camera!</Text>
          <Text style={styles.subtitle}>
            Grant camera access to take pictures and capture moments.
          </Text>

          {/* Permissions Container */}
          <View style={styles.permissionContainer}>
            <Pressable
              style={[
                styles.permissionBox,
                cameraPermissionLocked && { backgroundColor: "#25252550" }, // Lock visually if granted
              ]}
              onPress={
                !cameraPermissionLocked ? requestCameraPermissionHandler : null
              }
            >
              <Icon
                name="camera"
                tintColor={"#fff"}
                style={styles.cameraIcon}
                noFill={true}
              />
              <View style={styles.permissionTextContainer}>
                <Text style={styles.permissionTitle}>Enable Camera Access</Text>
                <Text style={styles.permissionSubtitle}>
                  Tap here to grant access to your camera.
                </Text>
              </View>
            </Pressable>
          </View>

          {/* Next Step Button */}
          <ButtonSolid
            backgroundColor={isValid ? "#6AB95230" : "#1c1c1c"}
            borderColor={isValid ? "#6AB95250" : "#1c1c1c"}
            textColor={isValid ? "#6AB952" : "#696969"}
            width="50%"
            text="Create Profile"
            onPress={handleNextStep}
          />
        </View>

        {/* Bottom Container */}
        <View style={styles.bottomContainer}>
          <Image
            source={require("../../../../public/branding/lifelist-icon.png")}
            style={styles.logo}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topContainer: {
    alignItems: "center",
    marginTop: -4,
  },
  stepIndicator: {
    color: "#6AB952",
    marginBottom: 8,
  },
  progressBarContainer: {
    width: "80%",
    height: 4,
    flexDirection: "row",
    marginBottom: 24,
  },
  progressBarFilled: {
    flex: 1,
    backgroundColor: "#6AB952",
    borderRadius: 4,
  },
  progressBarEmpty: {
    backgroundColor: "#1c1c1c",
  },
  middleContainer: {
    alignItems: "center",
    width: "100%",
    marginBottom: 84,
  },
  stepTitle: {
    color: "#6AB952",
    fontWeight: "700",
    fontSize: 16,
    marginBottom: 4,
    textAlign: "left",
    width: "80%",
  },
  mainTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
    textAlign: "left",
    width: "80%",
    marginBottom: 8,
  },
  subtitle: {
    color: "#c7c7c7",
    fontSize: 14,
    textAlign: "left",
    width: "80%",
    marginBottom: 24,
  },
  permissionContainer: {
    width: "80%",
  },
  permissionBox: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#1c1c1c",
    marginBottom: 16,
  },
  permissionTextContainer: {
    width: "80%",
  },
  permissionTitle: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
    marginBottom: 4,
    marginLeft: 16,
  },
  permissionSubtitle: {
    color: "#c7c7c7",
    fontSize: 12,
    marginLeft: 16,
  },
  bottomContainer: {
    alignItems: "center",
    marginBottom: 64,
  },
  logo: {
    width: 48,
    height: 41.6,
  },
  /* cameraIcon: {
    width: 36,
    height: 36,
  }, */
  cameraIcon: {
    width: 32,
    height: 25.3,
  },
});
