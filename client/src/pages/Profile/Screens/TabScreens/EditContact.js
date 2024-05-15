import { Text, TextInput, View } from "react-native";
import { formStyles, headerStyles, layoutStyles } from "../../../../styles";
import { useState, useEffect } from "react";
import BottomContainer from "../../../../components/BottomContainer";
import SolidButton from "../../../../components/SolidButton";
import OutlinedButton from "../../../../components/OutlinedButton";
import { useMutation } from "@apollo/client";
import {
  UPDATE_EMAIL,
  UPDATE_PHONE_NUMBER,
  UPDATE_PASSWORD,
} from "../../../../utils/mutations";
import { useAuth } from "../../../../contexts/AuthContext";

export default function EditContact() {
  const { currentUser, updateCurrentUser } = useAuth();
  const [email, setEmail] = useState(currentUser.email || "");
  const [phoneNumber, setPhoneNumber] = useState(currentUser.phoneNumber || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [changesMade, setChangesMade] = useState(false);

  // Define mutations
  const [updateEmailMutation] = useMutation(UPDATE_EMAIL);
  const [updatePhoneNumberMutation] = useMutation(UPDATE_PHONE_NUMBER);
  const [updatePasswordMutation] = useMutation(UPDATE_PASSWORD);

  useEffect(() => {
    const passwordFieldsFilled =
      currentPassword !== "" &&
      newPassword !== "" &&
      confirmNewPassword !== "" &&
      newPassword === confirmNewPassword;
    setChangesMade(
      email !== currentUser.email ||
        phoneNumber !== currentUser.phoneNumber ||
        passwordFieldsFilled
    );
  }, [
    email,
    phoneNumber,
    currentPassword,
    newPassword,
    confirmNewPassword,
    currentUser,
  ]);

  const handleUpdateContact = async () => {
    try {
      if (email !== currentUser.email && email !== "") {
        const { data } = await updateEmailMutation({ variables: { email } });
        updateCurrentUser({ email: data.updateEmail.email });
      }
      if (phoneNumber !== currentUser.phoneNumber && phoneNumber !== "") {
        const { data } = await updatePhoneNumberMutation({
          variables: { phoneNumber },
        });
        updateCurrentUser({ phoneNumber: data.updatePhoneNumber.phoneNumber });
      }
      if (
        currentPassword &&
        newPassword &&
        newPassword === confirmNewPassword
      ) {
        await updatePasswordMutation({
          variables: { currentPassword, newPassword },
        });
      }
      // Show success message or update UI accordingly
    } catch (error) {
      console.error("Failed to update contact information", error);
    }
  };

  const discardChanges = () => {
    setEmail(currentUser.email || "");
    setPhoneNumber(currentUser.phoneNumber || "");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
    setChangesMade(false);
  };

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
          />
        </View>
        <View style={formStyles.inputContainer}>
          <Text style={layoutStyles.marginBtmTy}>Phone Number</Text>
          <TextInput
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            style={formStyles.input}
          />
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
            secureTextEntry
          />
        </View>
        <View style={formStyles.inputContainer}>
          <Text style={layoutStyles.marginBtmTy}>New Password</Text>
          <TextInput
            value={newPassword}
            onChangeText={setNewPassword}
            style={formStyles.input}
            secureTextEntry
          />
        </View>
        <View style={formStyles.inputContainer}>
          <Text style={layoutStyles.marginBtmTy}>Confirm New Password</Text>
          <TextInput
            value={confirmNewPassword}
            onChangeText={setConfirmNewPassword}
            style={formStyles.input}
            secureTextEntry
          />
        </View>
        {changesMade && (
          <BottomContainer
            topButton={
              <SolidButton
                backgroundColor={"#6AB952"}
                text={"Save Changes"}
                textColor={"#ffffff"}
                onPress={handleUpdateContact}
              />
            }
            bottomButton={
              <OutlinedButton
                borderColor={"#d4d4d4"}
                text={"Discard"}
                onPress={discardChanges}
              />
            }
          />
        )}
      </View>
    </View>
  );
}
