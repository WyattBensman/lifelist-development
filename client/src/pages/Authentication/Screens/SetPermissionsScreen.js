import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Pressable, Alert } from "react-native";
import { Image } from "expo-image";
import { useNavigation } from "@react-navigation/native";
import { useCameraPermissions } from "expo-camera";
import ButtonSolid from "../../../components/Buttons/ButtonSolid";
import HeaderStack from "../../../components/Headers/HeaderStack";
import Icon from "../../../components/Icons/Icon";
import { layoutStyles, iconStyles } from "../../../styles";
import { useMutation, useLazyQuery } from "@apollo/client";
import { GET_PRESIGNED_URL } from "../../../utils/queries";
import { CREATE_PROFILE } from "../../../utils/mutations";
import { useAuth } from "../../../contexts/AuthContext";
import { useCreateProfileContext } from "../../../contexts/CreateProfileContext";

export default function SetPermissionsScreen() {
  const navigation = useNavigation();
  const { login } = useAuth();
  const { profile } = useCreateProfileContext();
  const [createProfile] = useMutation(CREATE_PROFILE);
  const [getPresignedUrl] = useLazyQuery(GET_PRESIGNED_URL);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [cameraPermissionLocked, setCameraPermissionLocked] = useState(false);
  const [isValid, setIsValid] = useState(false);

  const checkPermissions = async () => {
    const { status } = await cameraPermission.get();
    setIsValid(status === "granted");
    setCameraPermissionLocked(status === "granted");
  };

  useEffect(() => {
    checkPermissions();
  }, []);

  const requestPermissionHandler = async () => {
    const { status } = await requestCameraPermission();
    setIsValid(status === "granted");
    setCameraPermissionLocked(status === "granted");
  };

  const handleCreateProfile = async () => {
    if (!isValid) {
      Alert.alert("Permissions Required", "Camera access is required.");
      return;
    }

    let profilePictureUrl = null;

    try {
      // Log start of the process
      console.log("Starting CreateProfile process...");

      // Step 1: Get Presigned URL if a profile picture exists
      if (profile.profilePicture) {
        console.log("Profile picture exists, preparing to upload...");

        const fileName = profile.profilePicture.split("/").pop();
        console.log(`Extracted file name: ${fileName}`);

        const { data } = await getPresignedUrl({
          variables: {
            folder: "profile-images",
            fileName,
            fileType: "image/jpeg",
          },
        });

        console.log("Received presigned URL data:", data);

        const { presignedUrl, fileUrl } = data.getPresignedUrl;

        // Log presigned URL and file URL
        console.log("Presigned URL:", presignedUrl);
        console.log("File URL:", fileUrl);

        // Step 2: Upload the image to S3
        console.log("Fetching image from profile picture URI...");
        const response = await fetch(profile.profilePicture);

        if (!response.ok) {
          console.error("Error fetching profile picture:", response.statusText);
          throw new Error("Failed to fetch profile picture.");
        }

        const blob = await response.blob();

        console.log("Uploading image to S3...");
        const uploadResponse = await fetch(presignedUrl, {
          method: "PUT",
          headers: { "Content-Type": blob.type },
          body: blob,
        });

        if (!uploadResponse.ok) {
          console.error("Error uploading to S3:", uploadResponse.statusText);
          console.log("Upload response:", await uploadResponse.text());
          throw new Error("Failed to upload image to S3.");
        }

        console.log("Image uploaded successfully!");
        profilePictureUrl = fileUrl; // Save the S3 URL
      } else {
        console.log("No profile picture provided, skipping upload.");
      }

      // Step 3: Execute CreateProfile mutation
      console.log("Preparing to execute CreateProfile mutation...");
      console.log("Mutation input data:", {
        ...profile,
        profilePicture: profilePictureUrl,
      });
      const { data } = await createProfile({
        variables: {
          input: {
            ...profile,
            profilePicture: profilePictureUrl,
          },
        },
      });

      console.log("Profile creation successful:", data);

      const { token } = data.createProfile;

      console.log("Logging in user...");
      await login(token);

      console.log("User logged in successfully, navigating to Dashboard.");
    } catch (error) {
      console.error("Create Profile Error:", error.message);
      Alert.alert("Error", "Failed to create profile. Please try again.");
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
          <Text style={styles.stepTitle}>Step 4</Text>
          <Text style={styles.mainTitle}>Don't forget your Camera!</Text>
          <Text style={styles.subtitle}>
            Grant camera access to take pictures and capture moments.
          </Text>

          {/* Permissions Container */}
          <View style={styles.permissionContainer}>
            <Pressable
              style={[
                styles.permissionBox,
                cameraPermissionLocked && { backgroundColor: "#25252550" },
              ]}
              onPress={
                !cameraPermissionLocked ? requestPermissionHandler : null
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
            onPress={handleCreateProfile}
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
  cameraIcon: {
    width: 32,
    height: 25.3,
  },
});
