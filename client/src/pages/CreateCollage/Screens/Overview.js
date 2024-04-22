import { Text, View, TextInput, Image } from "react-native";
import {
  layoutStyles,
  formStyles,
  authenticationStyles,
} from "../../../styles";
import BackArrowIcon from "../../../icons/Universal/BackArrowIcon";
import { useNavigation } from "@react-navigation/native";
import NextPageArrowIcon from "../../../icons/Universal/NextPageArrowIcon";
import HeaderStack from "../../../components/Headers/HeaderStack";
import { useState } from "react";
import ButtonSolid from "../../../components/Buttons/ButtonSolid";

export default function Overview() {
  const navigation = useNavigation();
  const [caption, setCaption] = useState("");
  const [date, setDate] = useState("");

  return (
    <View style={layoutStyles.container}>
      <HeaderStack
        title={"Overview"}
        arrow={<BackArrowIcon navigation={navigation} />}
        button1={
          <NextPageArrowIcon
            navigation={navigation}
            navigateTo={"CollagePreview"}
          />
        }
      />
      <View style={[formStyles.formContainer, layoutStyles.marginTopLg]}>
        <View style={[layoutStyles.marginBtmMd, { alignSelf: "center" }]}>
          <Image
            source={require("../../../../public/images/wyattbensman.png")}
            style={authenticationStyles.profilePictureContainer}
          />
          <Text style={layoutStyles.marginTopXs}>Change Cover Image</Text>
        </View>
        <Text style={formStyles.label}>Caption</Text>
        <TextInput
          style={formStyles.input}
          onChangeText={setCaption}
          value={caption}
        />
        <Text style={[formStyles.label, formStyles.inputSpacer]}>Gender</Text>
        <TextInput
          style={formStyles.input}
          onChangeText={setDate}
          value={date}
        />
        <ButtonSolid
          text={"Create Account"}
          backgroundColor={"#ececec"}
          marginTop={12}
          onPress={() => navigation.navigate("SetProfileInformation")}
        />
      </View>
    </View>
  );
}
