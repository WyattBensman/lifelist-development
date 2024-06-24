import {
  Text,
  TextInput,
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useState, useEffect } from "react";
import BottomButtonContainer from "../../../../components/Containers/BottomButtonContainer";
import SolidButton from "../../../../components/SolidButton";
import OutlinedButton from "../../../../components/OutlinedButton";
import { useMutation } from "@apollo/client";
import {
  UPDATE_EMAIL,
  UPDATE_PHONE_NUMBER,
  UPDATE_PASSWORD,
} from "../../../../utils/mutations";
import { useAuth } from "../../../../contexts/AuthContext";
import { formStyles, headerStyles, layoutStyles } from "../../../../styles";

export default function EditContact() {
  const { currentUser, updateCurrentUser } = useAuth();
  const [email, setEmail] = useState(currentUser.email || "");
  const [phoneNumber, setPhoneNumber] = useState(currentUser.phoneNumber || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [changesMade, setChangesMade] = useState(false);

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
        <View style={styles.row}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor="#d4d4d4"
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Phone</Text>
          <TextInput
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            style={styles.input}
            placeholder="Enter your phone number"
            placeholderTextColor="#d4d4d4"
          />
        </View>
        <Text style={[headerStyles.headerMedium, layoutStyles.marginTopXs]}>
          Change Password
        </Text>
        <View style={styles.row}>
          <Text style={styles.label}>Current</Text>
          <TextInput
            value={currentPassword}
            onChangeText={setCurrentPassword}
            style={styles.input}
            placeholder="Enter your current password"
            placeholderTextColor="#d4d4d4"
            secureTextEntry
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>New</Text>
          <TextInput
            value={newPassword}
            onChangeText={setNewPassword}
            style={styles.input}
            placeholder="Enter your new password"
            placeholderTextColor="#d4d4d4"
            secureTextEntry
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Confirm</Text>
          <TextInput
            value={confirmNewPassword}
            onChangeText={setConfirmNewPassword}
            style={styles.input}
            placeholder="Confirm your new password"
            placeholderTextColor="#d4d4d4"
            secureTextEntry
          />
        </View>
        {changesMade && (
          <BottomButtonContainer
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

const styles = StyleSheet.create({
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
