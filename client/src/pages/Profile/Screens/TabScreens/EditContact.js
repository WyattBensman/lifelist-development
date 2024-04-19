import { Text, TextInput, View } from "react-native";
import { formStyles, headerStyles, layoutStyles } from "../../../../styles";
import { useState } from "react";
import BottomContainer from "../../../../components/BottomContainer";
import SolidButton from "../../../../components/SolidButton";
import OutlinedButton from "../../../../components/OutlinedButton";

export default function EditContact() {
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  return (
    <View style={layoutStyles.wrapper}>
      <View style={formStyles.formContainer}>
        <Text style={headerStyles.headerMedium}>Contact Information</Text>
        <View style={formStyles.inputContainer}>
          <Text style={layoutStyles.marginBtmTy}>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            style={formStyles.input}
          ></TextInput>
        </View>
        <View style={formStyles.inputContainer}>
          <Text style={layoutStyles.marginBtmTy}>Phone Number</Text>
          <TextInput
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            style={formStyles.input}
          ></TextInput>
        </View>
        <Text style={[headerStyles.headerMedium, layoutStyles.marginTopXs]}>
          Change Password
        </Text>
        <View style={formStyles.inputContainer}>
          <Text style={layoutStyles.marginBtmTy}>Current Password</Text>
          <TextInput
            value={currentPassword}
            onChangeText={setCurrentPassword}
            style={formStyles.input}
          ></TextInput>
        </View>
        <View style={formStyles.inputContainer}>
          <Text style={layoutStyles.marginBtmTy}>New Password</Text>
          <TextInput
            value={newPassword}
            onChangeText={setNewPassword}
            style={formStyles.input}
          ></TextInput>
        </View>
        <View style={formStyles.inputContainer}>
          <Text style={layoutStyles.marginBtmTy}>Confirm New Password</Text>
          <TextInput
            value={confirmNewPassword}
            onChangeText={setConfirmNewPassword}
            style={formStyles.input}
          ></TextInput>
        </View>
      </View>
      {/* <BottomContainer
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
    </View>
  );
}
