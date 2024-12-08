import React, { useEffect } from "react";
import {
  Text,
  View,
  TextInput,
  Image,
  StyleSheet,
  Pressable,
} from "react-native";
import { layoutStyles, formStyles, iconStyles } from "../../../styles";
import { useNavigation } from "@react-navigation/native";
import HeaderStack from "../../../components/Headers/HeaderStack";
import Icon from "../../../components/Icons/Icon";
import { useNavigationContext } from "../../../contexts/NavigationContext";
import ButtonSolid from "../../../components/Buttons/ButtonSolid";
import { useCreateCollageContext } from "../../../contexts/CreateCollageContext";

export default function Overview() {
  const navigation = useNavigation();
  const { collage, updateCollage } = useCreateCollageContext(); // Access collage methods
  const { setIsTabBarVisible } = useNavigationContext();

  // Access caption and coverImage directly from the collage context
  const { caption, coverImage, images } = collage;

  // Ensure tab bar is hidden when this screen is focused
  useEffect(() => {
    setIsTabBarVisible(false);
  }, []);

  // If there's no cover image yet, use the first image in the collage
  const currentCoverImage = coverImage || images[0]?.imageThumbnail || null;

  // Handle caption change: Update directly into the collage context
  const handleCaptionChange = (text) => {
    updateCollage({ caption: text });
  };

  // Pass updated collage info to the Preview screen
  const handlePreview = () => {
    navigation.navigate("CollagePreview");
  };

  // Navigate to AddParticipants screen
  const handleAddParticipants = () => {
    navigation.navigate("AddParticipants");
  };

  // Navigate to ChangeCoverImage screen
  const handleChangeCoverImage = () => {
    navigation.navigate("ChangeCoverImage"); // No need to pass params; cover image is in the context
  };

  return (
    <View style={layoutStyles.wrapper}>
      {/* Header */}
      <HeaderStack
        title={"Overview"}
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
            onPress={handlePreview}
            weight="heavy" // Always active, use the heavy weight
            tintColor="#6AB952" // Green color for active state
            style={iconStyles.backArrow} // Reuse style from back arrow for consistency
          />
        }
      />

      {/* Form Section */}
      <View style={[formStyles.formContainer, layoutStyles.marginTopLg]}>
        {/* Change Cover Image */}
        <Pressable
          style={[layoutStyles.marginBtmMd, { alignSelf: "center" }]}
          onPress={handleChangeCoverImage}
        >
          {currentCoverImage ? (
            <Image source={{ uri: currentCoverImage }} style={styles.image} />
          ) : (
            <Text style={styles.placeholderText}>No Cover Image Selected</Text>
          )}
          <Text style={[layoutStyles.marginTopXs, { color: "#fff" }]}>
            Change Cover Image
          </Text>
        </Pressable>

        {/* Caption Input */}
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Caption</Text>
          <TextInput
            style={styles.input}
            onChangeText={handleCaptionChange} // Directly update context on change
            value={caption} // Use caption from context
            placeholder="Enter your caption"
            placeholderTextColor="#d4d4d4"
          />
        </View>

        {/* Bottom Buttons */}
        <View style={styles.bottomButtonContainer}>
          <ButtonSolid
            backgroundColor="#252525"
            textColor="#fff"
            borderColor="#252525"
            width="94%"
            text="Add Locations"
            marginTop={12}
            onPress={() => console.log("Add Locations pressed")}
          />
          <ButtonSolid
            backgroundColor="#252525"
            textColor="#fff"
            borderColor="#252525"
            width="94%"
            text="Tag Users"
            marginTop={12}
            onPress={handleAddParticipants}
          />
          <ButtonSolid
            backgroundColor="#252525"
            textColor="#fff"
            borderColor="#252525"
            width="94%"
            text="Set Audience"
            marginTop={12}
            onPress={() => console.log("Set Audience pressed")}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    height: 175,
    width: 120,
    borderRadius: 4,
    alignSelf: "center",
  },
  placeholderText: {
    height: 175,
    width: 120,
    textAlign: "center",
    color: "#d4d4d4",
    alignSelf: "center",
    fontWeight: "600",
    paddingTop: 60,
  },
  bottomButtonContainer: {
    marginTop: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  inputWrapper: {
    width: "94%",
    marginBottom: 16,
    alignSelf: "center",
  },
  label: {
    color: "#fff",
    fontWeight: "500",
    marginBottom: 8,
    textAlign: "left",
  },
  input: {
    backgroundColor: "#252525",
    color: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#1c1c1c",
    width: "100%",
  },
});
