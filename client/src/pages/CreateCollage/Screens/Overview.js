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
import { useState } from "react";
import { BASE_URL } from "../../../utils/config";
import Icon from "../../../components/Icons/Icon";
import IconStatic from "../../../components/Icons/IconStatic";

export default function Overview({ route }) {
  const navigation = useNavigation();
  const { selectedImages } = route.params;
  const [caption, setCaption] = useState("");

  // Pass caption along with selectedImages to the Preview screen
  const handlePreview = () => {
    navigation.navigate("CollagePreview", { selectedImages, caption });
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
          <Pressable
            onPress={handlePreview}
            style={styles.previewButtonContainer}
          >
            <Text style={styles.previewButtonText}>Preview</Text>
          </Pressable>
        }
      />
      <View style={[formStyles.formContainer, layoutStyles.marginTopLg]}>
        <View style={[layoutStyles.marginBtmMd, { alignSelf: "center" }]}>
          <Image
            source={{ uri: `${BASE_URL}${selectedImages[0].image}` }}
            style={styles.image}
          />
          <Text style={[layoutStyles.marginTopXs, { color: "#fff" }]}>
            Change Cover Image
          </Text>
        </View>
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
            <IconStatic
              name="plus.circle"
              style={iconStyles.plusCircle}
              tintColor={"#fff"}
            />
            <Text style={styles.buttonText}>Add Locations</Text>
          </Pressable>
          <Pressable style={styles.buttonContainer}>
            <IconStatic
              name="plus.circle"
              style={iconStyles.plusCircle}
              tintColor={"#fff"}
            />
            <Text style={styles.buttonText}>Add Participants</Text>
          </Pressable>
          <Pressable style={styles.buttonContainer}>
            <IconStatic
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
    height: 40,
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
  previewButtonContainer: {
    backgroundColor: "#252525",
    paddingVertical: 6,
    paddingHorizontal: 13,
    borderRadius: 12,
  },
  previewButtonText: {
    color: "#6AB952",
    fontWeight: "600",
  },
  previewButtonActiveContainer: {
    backgroundColor: "#6AB95230",
  },
  previewButtonActiveText: {
    color: "#6AB952",
    fontWeight: "500",
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
    flex: 1, // Make input take the remaining space
    color: "#ececec",
    height: 42,
    paddingHorizontal: 10, // Adjust padding as needed
    borderRadius: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#252525",
  },
});
