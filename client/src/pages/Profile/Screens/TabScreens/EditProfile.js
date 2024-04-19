import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { formStyles, headerStyles, layoutStyles } from "../../../../styles";
import { useState } from "react";
import ForwardArrowIcon from "../../../../icons/Universal/ForwardArrowIcon";
import BottomButtonContainer from "../../../../components/Containers/BottomButtonContainer";
import SolidButton from "../../../../components/SolidButton";
import OutlinedButton from "../../../../components/OutlinedButton";

export default function EditProfileTab() {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [birthday, setBirthday] = useState("");
  const [gender, setGender] = useState("");

  return (
    <KeyboardAvoidingView
      style={layoutStyles.wrapper}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        style={formStyles.formContainer}
        keyboardDismissMode="on-drag"
      >
        <View style={[layoutStyles.marginBtmSm, { alignItems: "center" }]}>
          <Image
            source={require("../../../../../public/images/wyattbensman.png")}
            style={styles.profilePicture}
          />
          <Text style={layoutStyles.marginTopXxs}>Change Profile Picture</Text>
        </View>
        <View style={formStyles.inputContainer}>
          <Text style={layoutStyles.marginBtmTy}>Full Name</Text>
          <TextInput
            value={fullName}
            onChangeText={setFullName}
            style={formStyles.input}
          ></TextInput>
        </View>
        <View style={formStyles.inputContainer}>
          <Text style={layoutStyles.marginBtmTy}>Username</Text>
          <TextInput
            value={username}
            onChangeText={setUsername}
            style={formStyles.input}
          ></TextInput>
        </View>
        <View style={formStyles.inputContainer}>
          <Text style={layoutStyles.marginBtmTy}>Bio</Text>
          <TextInput
            value={bio}
            onChangeText={setBio}
            style={formStyles.input}
          ></TextInput>
        </View>
        <View style={[layoutStyles.flex, layoutStyles.marginBtmMd]}>
          <Text style={{ fontWeight: "500" }}>Flowpage</Text>
          <ForwardArrowIcon />
        </View>
        <Text style={[headerStyles.headerMedium, { marginTop: 8 }]}>
          Personal Information
        </Text>
        <View style={formStyles.inputContainer}>
          <Text style={layoutStyles.marginBtmTy}>Birthday</Text>
          <TextInput
            value={birthday}
            onChangeText={setBirthday}
            style={formStyles.input}
          ></TextInput>
        </View>
        <View style={formStyles.inputContainer}>
          <Text style={layoutStyles.marginBtmTy}>Gender</Text>
          <TextInput
            value={gender}
            onChangeText={setGender}
            style={formStyles.input}
          ></TextInput>
        </View>
      </ScrollView>
      {/* Only appears if a change was made */}
      {/* <BottomButtonContainer
        topButton={
          <SolidButton
            backgroundColor={"#d4d4d4"}
            text={"Save Changes"}
            textColor={"#ffffff"}
          />
        }
        bottomButton={
          <OutlinedButton borderColor={"#d4d4d4"} text={"Discard"} />
        }
      /> */}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  profilePicture: {
    height: 85,
    width: 85,
    borderRadius: 4,
  },
});
