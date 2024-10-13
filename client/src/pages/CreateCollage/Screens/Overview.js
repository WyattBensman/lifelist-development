import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TextInput,
  Image,
  StyleSheet,
  Pressable,
} from "react-native";
import { layoutStyles, formStyles, iconStyles } from "../../../styles";
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import HeaderStack from "../../../components/Headers/HeaderStack";
import { BASE_URL } from "../../../utils/config";
import Icon from "../../../components/Icons/Icon";
import { useNavigationContext } from "../../../contexts/NavigationContext";
import ButtonSolid from "../../../components/Buttons/ButtonSolid";

export default function Overview({ route }) {
  const navigation = useNavigation();
  const { selectedImages, coverImage, taggedUsers = [] } = route.params;
  const [caption, setCaption] = useState("");
  const { setIsTabBarVisible } = useNavigationContext();

  useFocusEffect(() => {
    setIsTabBarVisible(false);
  });

  // State to store the current cover image
  const [currentCoverImage, setCurrentCoverImage] = useState(
    coverImage || selectedImages[0].image
  );

  // Update the cover image if it changes in the route params
  useEffect(() => {
    if (coverImage) {
      setCurrentCoverImage(coverImage);
    }
  }, [coverImage]);

  // Pass caption along with selectedImages and taggedUsers to the Preview screen
  const handlePreview = () => {
    navigation.navigate("CollagePreview", {
      selectedImages,
      caption,
      taggedUsers,
      coverImage: currentCoverImage,
    });
  };

  // Navigate to AddParticipants screen
  const handleAddParticipants = () => {
    navigation.navigate("AddParticipants", {
      selectedImages,
      caption,
      taggedUsers,
    });
  };

  // Navigate to ChangeCoverImage screen
  const handleChangeCoverImage = () => {
    navigation.navigate("ChangeCoverImage", {
      selectedImages,
      currentCoverImage,
    });
  };

  return (
    <View style={layoutStyles.wrapper}>
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
      <View style={[formStyles.formContainer, layoutStyles.marginTopLg]}>
        <Pressable
          style={[layoutStyles.marginBtmMd, { alignSelf: "center" }]}
          onPress={handleChangeCoverImage}
        >
          <Image
            source={{ uri: `${BASE_URL}${currentCoverImage}` }}
            style={styles.image}
          />
          <Text style={[layoutStyles.marginTopXs, { color: "#fff" }]}>
            Change Cover Image
          </Text>
        </Pressable>
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Caption</Text>
          <TextInput
            style={styles.input}
            onChangeText={setCaption}
            value={caption}
            placeholder="Enter your caption"
            placeholderTextColor="#d4d4d4"
          />
        </View>

        <View style={styles.bottomButtonContainer}>
          <ButtonSolid
            backgroundColor="#252525" // Background color for button
            textColor="#fff" // Text color for button
            borderColor="#252525" // Optional border color
            width="94%" // Match input width
            text="Add Locations"
            marginTop={12}
            onPress={() => console.log("Add Locations pressed")}
          />
          <ButtonSolid
            backgroundColor="#252525" // Background color for button
            textColor="#fff" // Text color for button
            borderColor="#252525" // Optional border color
            width="94%" // Match input width
            text="Tag Users"
            marginTop={12}
            onPress={handleAddParticipants}
          />
          <ButtonSolid
            backgroundColor="#252525" // Background color for button
            textColor="#fff" // Text color for button
            borderColor="#252525" // Optional border color
            width="94%" // Match input width
            text="Set Audience"
            marginTop={12}
            onPress={() => console.log("Add Locations pressed")}
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
  bottomButtonContainer: {
    marginTop: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    marginBottom: 12,
    height: 37,
    backgroundColor: "#252525",
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    fontWeight: "500",
    textAlign: "center",
    marginLeft: 6,
    color: "#fff",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
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
