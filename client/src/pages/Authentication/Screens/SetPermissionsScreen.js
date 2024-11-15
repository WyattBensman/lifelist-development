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
import * as Contacts from "expo-contacts";
import ButtonSolid from "../../../components/Buttons/ButtonSolid";
import HeaderStack from "../../../components/Headers/HeaderStack";
import Icon from "../../../components/Icons/Icon";
import { layoutStyles, iconStyles } from "../../../styles";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SetPermissionsScreen() {
  // Using the useCameraPermissions hook
  const [cameraPermission, requestCameraPermission, getCameraPermission] =
    useCameraPermissions();
  const [contactsPermission, setContactsPermission] = useState(false);
  const [cameraPermissionLocked, setCameraPermissionLocked] = useState(false);
  const [contactsPermissionLocked, setContactsPermissionLocked] =
    useState(false);
  const [isValid, setIsValid] = useState(false);
  const [permissionsChecked, setPermissionsChecked] = useState(false); // New state for initial permissions check
  const navigation = useNavigation();

  // Use useEffect to check permissions only once when the component mounts
  useEffect(() => {
    if (!permissionsChecked) {
      checkPermissions();
    }
  }, [permissionsChecked]);

  // Function to check both camera and contacts permissions
  const checkPermissions = async () => {
    try {
      // Use getPermissionsAsync() to check the status without prompting the user
      const [cameraStatus, contactsStatus] = await Promise.all([
        getCameraPermission(),
        Contacts.getPermissionsAsync(),
      ]);

      const cameraGranted = cameraStatus.status === "granted";
      const contactsGranted = contactsStatus.status === "granted";

      // Log the current status of both permissions
      console.log(`Camera Permission: ${cameraGranted}`);
      console.log(`Contacts Permission: ${contactsGranted}`);

      // Update states based on permission status
      setContactsPermission(contactsGranted);
      setCameraPermissionLocked(cameraGranted);
      setContactsPermissionLocked(contactsGranted);

      checkPermissionsValidity(cameraGranted, contactsGranted);

      setPermissionsChecked(true); // Mark permissions as checked
    } catch (error) {
      console.error("Error checking permissions: ", error);
    }
  };

  // Request Camera Permission
  const requestCameraPermissionHandler = async () => {
    try {
      const { status, canAskAgain } = await requestCameraPermission();
      if (status === "granted") {
        setCameraPermissionLocked(true);
      } else if (status === "denied" && !canAskAgain) {
        setCameraPermissionLocked(true);
        showSettingsAlert("Camera");
      }
      checkPermissionsValidity(status === "granted", contactsPermission);
    } catch (error) {
      console.error("Error requesting camera permission:", error);
    }
  };

  // Request Contacts Permission
  const requestContactsPermission = async () => {
    try {
      const { status, canAskAgain } = await Contacts.requestPermissionsAsync();
      if (status === "granted") {
        setContactsPermission(true);
        setContactsPermissionLocked(true);
      } else if (status === "denied" && !canAskAgain) {
        setContactsPermissionLocked(true);
        showSettingsAlert("Contacts");
      }
      checkPermissionsValidity(cameraPermission?.granted, status === "granted");
    } catch (error) {
      console.error("Error requesting contacts permission:", error);
    }
  };

  // Check if both permissions are granted to enable next step
  const checkPermissionsValidity = (cameraGranted, contactsGranted) => {
    setIsValid(cameraGranted && contactsGranted);
  };

  // Show alert to prompt the user to open settings if permissions are denied permanently
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

  // Handle navigation to the next step and save progress
  const handleNextStep = async () => {
    if (isValid) {
      try {
        // Save registration progress to AsyncStorage
        await AsyncStorage.setItem("registrationProgress", "ShareEarlyAccess");
        navigation.navigate("ShareEarlyAccess");
      } catch (error) {
        console.error("Error saving registration progress:", error);
      }
    } else {
      Alert.alert(
        "Permissions Required",
        "Both Camera and Contacts permissions are required to proceed."
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
          <Text style={styles.stepIndicator}>3 of 4 Steps</Text>
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarFilled} />
            <View style={styles.progressBarEmpty} />
          </View>
        </View>

        {/* Middle Container */}
        <View style={styles.middleContainer}>
          <Text style={styles.stepTitle}>Step 3</Text>
          <Text style={styles.mainTitle}>Permissions</Text>
          <Text style={styles.subtitle}>
            Tap on the boxes below to grant Camera and Contacts access.
          </Text>

          {/* Permissions Container */}
          <View style={styles.permissionContainer}>
            {/* Camera Permission */}
            <Pressable
              style={[
                styles.permissionBox,
                cameraPermissionLocked && { backgroundColor: "#25252550" }, // Lock visually if granted
              ]}
              onPress={!cameraPermissionLocked ? requestCameraPermission : null}
            >
              <View style={styles.permissionTextContainer}>
                <Text style={styles.permissionTitle}>Camera</Text>
                <Text style={styles.permissionSubtitle}>
                  Allow access for the camera component.
                </Text>
              </View>
            </Pressable>

            {/* Contacts Permission */}
            <Pressable
              style={[
                styles.permissionBox,
                contactsPermissionLocked && { backgroundColor: "#25252550" }, // Lock visually if granted
              ]}
              onPress={
                !contactsPermissionLocked ? requestContactsPermission : null
              }
            >
              <View style={styles.permissionTextContainer}>
                <Text style={styles.permissionTitle}>Contacts</Text>
                <Text style={styles.permissionSubtitle}>
                  Invite your friends to join the application.
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
            text="Next Step"
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
    flex: 0.75,
    backgroundColor: "#6AB952",
    borderRadius: 4,
  },
  progressBarEmpty: {
    flex: 0.25,
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
    textAlign: "left", // Left-align step title
    width: "80%", // Ensure it aligns within 80% of the screen
  },
  mainTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
    textAlign: "left", // Left-align main title
    width: "80%", // Ensure it aligns within 80% of the screen
    marginBottom: 8,
  },
  subtitle: {
    color: "#c7c7c7",
    fontSize: 14,
    textAlign: "left", // Left-align subtitle
    width: "80%", // Ensure it aligns within 80% of the screen
    marginBottom: 24,
  },
  inputWrapper: {
    width: "80%", // Set input fields to 80% of the screen width
    marginBottom: 16,
    alignSelf: "center", // Ensure inputs are centered
  },
  label: {
    color: "#fff",
    fontWeight: "500",
    marginBottom: 8,
    textAlign: "left", // Ensure labels are left-aligned
  },
  input: {
    backgroundColor: "#252525",
    color: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#1c1c1c",
    width: "100%",
  },
  passwordWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  eyeIcon: {
    color: "#6AB952",
    fontSize: 16,
    padding: 8,
  },
  bottomContainer: {
    alignItems: "center",
    marginBottom: 64,
  },
  logo: {
    width: 48,
    height: 41.6,
  },
  permissionContainer: {
    width: "80%", // Set container width to 80% of the screen
  },
  permissionBox: {
    flexDirection: "row",
    justifyContent: "space-between",
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
  },
  permissionSubtitle: {
    color: "#c7c7c7",
    fontSize: 12,
  },
});

/*   // Open app settings if permissions are denied
  const handleOpenSettings = () => {
    Alert.alert(
      "Permissions Required",
      "Camera and Contacts permissions are required to proceed. Please enable them in settings.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Open Settings", onPress: () => Linking.openSettings() },
      ]
    );
  };

  // Check permissions on screen focus
  useFocusEffect(
    React.useCallback(() => {
      const checkPermissions = async () => {
        try {
          const { status: cameraStatus } =
            await Camera.getCameraPermissionsAsync();
          const { status: contactsStatus } =
            await Contacts.getPermissionsAsync();

          setCameraPermission(cameraStatus === "granted");
          setContactsPermission(contactsStatus === "granted");
          setCameraPermissionLocked(cameraStatus === "granted");
          setContactsPermissionLocked(contactsStatus === "granted");

          checkPermissionsValidity(cameraStatus, contactsStatus);
        } catch (error) {
          console.error("Error checking permissions:", error);
        }
      };

      checkPermissions(); // Check permissions on screen focus
    }, [])
  ); */

/*  */
/*  */

/*               <Checkbox
                value={cameraPermission}
                onValueChange={setCameraPermission}
                style={[
                  styles.checkbox,
                  cameraPermission && styles.checkboxActive,
                ]}
                color={cameraPermission ? "#6AB95250" : undefined}
                disabled={cameraPermissionLocked} // Disable checkbox if permission is locked
              /> */

{
  /* <Checkbox
                value={contactsPermission}
                onValueChange={setContactsPermission}
                style={[
                  styles.checkbox,
                  contactsPermission && styles.checkboxActive,
                ]}
                color={contactsPermission ? "#6AB95250" : undefined}
                disabled={contactsPermissionLocked} // Disable checkbox if permission is locked
              /> */
}

/* checkbox: {
  width: 20,
  height: 20,
  borderRadius: 6,
  borderWidth: 1,
  borderColor: "#696969",
},
checkboxActive: {
  backgroundColor: "#6AB95250",
  borderColor: "#6AB95250",
}, */

/*   useEffect(() => {
    checkCurrentPermissions();
  }, []);

  // Check and update permissions state when the component is loaded or when navigating back
  const checkCurrentPermissions = async () => {
    // Check current Camera permission
    const cameraStatus = await Camera.getPermissionsAsync();
    const isCameraGranted = cameraStatus.status === "granted";

    setCameraPermission(isCameraGranted);
    setCameraPermissionLocked(isCameraGranted); // Lock if granted

    // Check current Contacts permission
    const contactsStatus = await Contacts.getPermissionsAsync();
    const isContactsGranted = contactsStatus.status === "granted";
    setContactsPermission(isContactsGranted);
    setContactsPermissionLocked(isContactsGranted); // Lock if granted

    setIsValid(isCameraGranted && isContactsGranted);
  };

  // Open app's settings page
  const openAppSettings = () => {
    Linking.openSettings().catch(() => {
      Alert.alert(
        "Error",
        "Unable to open app settings. Please open them manually."
      );
    });
  };

  // Request Camera permission
  const requestCameraPermission = async () => {
    const { status } = await Camera.requestPermissionsAsync();
    if (status === "granted") {
      setCameraPermission(true);
      setCameraPermissionLocked(true); // Lock the camera permission box after granting
    } else {
      Alert.alert(
        "Permission Denied",
        "Camera access is required to use this feature. Please enable it in the settings.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Open Settings", onPress: openAppSettings },
        ]
      );
    }
    validatePermissions();
  };

  // Request Contacts permission
  const requestContactsPermission = async () => {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status === "granted") {
      setContactsPermission(true);
      setContactsPermissionLocked(true); // Lock the contacts permission box after granting
    } else {
      Alert.alert(
        "Permission Denied",
        "Contacts access is required to invite friends. Please enable it in the settings.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Open Settings", onPress: openAppSettings },
        ]
      );
    }
    validatePermissions();
  };

  // Validate if all necessary permissions are granted
  const validatePermissions = () => {
    setIsValid(cameraPermission && contactsPermission);
  };

  // Navigate to the next screen with updated user info
  const handleNextStep = () => {
    const updatedUserInfo = {
      ...userInfo,
      permissions: {
        camera: cameraPermission,
        contacts: contactsPermission,
      },
    };

    navigation.navigate("ShareEarlyAccess", { userInfo: updatedUserInfo });
  }; */
