import React, { useState } from "react";
import { Text, View, StyleSheet, Image, Pressable, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { useLazyQuery } from "@apollo/client";
import ButtonSolid from "../../../components/Buttons/ButtonSolid";
import HeaderStack from "../../../components/Headers/HeaderStack";
import Icon from "../../../components/Icons/Icon";
import { layoutStyles, iconStyles } from "../../../styles";
import { useCreateProfileContext } from "../../../contexts/CreateProfileContext"; // Import context
import { GET_PRESIGNED_URL } from "../../../utils/queries";

export default function SetProfilePictureScreen() {
  const navigation = useNavigation();
  const { profile, updateProfile } = useCreateProfileContext(); // Access context
  const [profilePicture, setProfilePicture] = useState(profile.profilePicture); // Initialize with context value

  const handleNextStep = () => {
    navigation.navigate("SetPermissions");
  };

  const resizeAndCompressImage = async (uri) => {
    try {
      const manipulatedImage = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 300, height: 300 } }],
        { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
      );
      return manipulatedImage.uri;
    } catch (error) {
      console.error("Error resizing/compressing image:", error.message);
      throw error;
    }
  };

  const selectProfilePicture = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "You need to enable permissions to access your camera roll."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const selectedImage = result.assets[0].uri;
      try {
        const resizedImageUri = await resizeAndCompressImage(selectedImage);
        setProfilePicture(resizedImageUri); // Update preview
        updateProfile("profilePicture", resizedImageUri); // Save locally in context
      } catch (error) {
        Alert.alert("Image Error", "Failed to process the selected image.");
      }
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
            tintColor={profilePicture ? "#6AB952" : "#696969"}
            style={iconStyles.backArrow}
            onPress={handleNextStep}
          />
        }
        hasBorder={false}
      />
      <View style={{ justifyContent: "space-between", flex: 1 }}>
        {/* Step Indicator and Progress Bar */}
        <View style={styles.topContainer}>
          <Text style={styles.stepIndicator}>3 of 4 Steps</Text>
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarFilled} />
            <View style={styles.progressBarEmpty} />
          </View>
        </View>

        {/* Main Content */}
        <View style={styles.middleContainer}>
          <Text style={styles.stepTitle}>Step 3</Text>
          <Text style={styles.mainTitle}>Say Cheddar Cheese!</Text>
          <Text style={styles.subtitle}>
            Let me see that beautiful smile of yours :)
          </Text>

          {/* Centered Square */}
          <Pressable style={styles.square} onPress={selectProfilePicture}>
            {profilePicture ? (
              <Image
                source={{ uri: profilePicture }}
                style={styles.profileImage}
                resizeMode="cover" // Ensures image fills the square
              />
            ) : (
              <Text style={styles.placeholderText}>Tap to Upload</Text>
            )}
          </Pressable>

          {/* Next Step or Skip Button */}
          <ButtonSolid
            backgroundColor={profilePicture ? "#6AB95230" : "#1c1c1c"}
            borderColor={profilePicture ? "#6AB95250" : "#1c1c1c"}
            textColor={profilePicture ? "#6AB952" : "#696969"}
            width="50%"
            text={profilePicture ? "Next Step" : "Skip"}
            onPress={handleNextStep}
          />
        </View>

        {/* Bottom Logo */}
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
  square: {
    width: "80%",
    aspectRatio: 1,
    backgroundColor: "#252525",
    borderRadius: 20,
    marginBottom: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  profileImage: {
    width: "100%",
    height: "100%",
    borderWidth: 2.5,
    borderColor: "#252525",
    borderRadius: 20,
  },
  placeholderText: {
    color: "#c7c7c7",
    fontSize: 16,
  },
  bottomContainer: {
    alignItems: "center",
    marginBottom: 64,
  },
  logo: {
    width: 48,
    height: 41.6,
  },
});
