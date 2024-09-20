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
        <View style={styles.row}>
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
          <Pressable style={styles.buttonContainer}>
            <Icon
              name="plus.circle"
              style={iconStyles.plusCircle}
              tintColor={"#fff"}
            />
            <Text style={styles.buttonText}>Add Locations</Text>
          </Pressable>
          <Pressable
            style={styles.buttonContainer}
            onPress={handleAddParticipants}
          >
            <Icon
              name="plus.circle"
              style={iconStyles.plusCircle}
              tintColor={"#fff"}
            />
            <Text style={styles.buttonText}>Tag Users</Text>
          </Pressable>
          <Pressable style={styles.buttonContainer}>
            <Icon
              name="plus.circle"
              style={iconStyles.plusCircle}
              tintColor={"#fff"}
            />
            <Text style={styles.buttonText}>Set Audience</Text>
          </Pressable>
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
  label: {
    width: 72,
    color: "#ffffff",
    fontWeight: "500",
  },
  input: {
    flex: 1,
    padding: 9,
    borderRadius: 8,
    backgroundColor: "#252525",
    color: "#fff",
    fontSize: 14,
    textAlign: "left",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
