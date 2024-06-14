import {
  Text,
  View,
  TextInput,
  Image,
  StyleSheet,
  Pressable,
} from "react-native";
import { layoutStyles, formStyles, iconStyles } from "../../../styles";
import BackArrowIcon from "../../../icons/Universal/BackArrowIcon";
import { useNavigation } from "@react-navigation/native";
import NextPageArrowIcon from "../../../icons/Universal/NextPageArrowIcon";
import HeaderStack from "../../../components/Headers/HeaderStack";
import { useState } from "react";
import { SymbolView } from "expo-symbols";
import { BASE_URL } from "../../../utils/config";

export default function Overview({ route }) {
  const navigation = useNavigation();
  const { selectedImages } = route.params;
  const [caption, setCaption] = useState("");

  // Pass caption along with selectedImages to the Preview screen
  const handlePreview = () => {
    navigation.navigate("CollagePreview", { selectedImages, caption });
  };

  return (
    <View style={layoutStyles.container}>
      <HeaderStack
        title={"Overview"}
        arrow={<BackArrowIcon navigation={navigation} />}
        button1={
          <Pressable onPress={handlePreview}>
            <Text>Preview</Text>
          </Pressable>
        }
      />
      <View style={[formStyles.formContainer, layoutStyles.marginTopLg]}>
        <View style={[layoutStyles.marginBtmMd, { alignSelf: "center" }]}>
          <Image
            source={{ uri: `${BASE_URL}${selectedImages[0].image}` }}
            style={styles.image}
          />
          <Text style={layoutStyles.marginTopXs}>Change Cover Image</Text>
        </View>
        <Text style={formStyles.label}>Caption</Text>
        <TextInput
          style={formStyles.input}
          onChangeText={setCaption}
          value={caption}
        />
        <View style={styles.bottomButtonContainer}>
          <Pressable style={styles.buttonContainer}>
            <SymbolView
              name="plus.circle"
              style={iconStyles.plusCircle}
              tintColor={"#000"}
            />
            <Text style={styles.buttonText}>Add Locations</Text>
          </Pressable>
          <Pressable style={styles.buttonContainer}>
            <SymbolView
              name="plus.circle"
              style={iconStyles.plusCircle}
              tintColor={"#000"}
            />
            <Text style={styles.buttonText}>Add Participants</Text>
          </Pressable>
          <Pressable style={styles.buttonContainer}>
            <SymbolView
              name="plus.circle"
              style={iconStyles.plusCircle}
              tintColor={"#000"}
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
    backgroundColor: "#ececec",
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontWeight: "500",
    textAlign: "center",
    marginLeft: 6,
  },
});
