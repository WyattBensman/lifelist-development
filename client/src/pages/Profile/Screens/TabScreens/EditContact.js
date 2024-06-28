import { Text, TextInput, View, StyleSheet } from "react-native";
import { useState, useEffect } from "react";
import BottomButtonContainer from "../../../../components/Containers/BottomButtonContainer";
import SolidButton from "../../../../components/SolidButton";
import OutlinedButton from "../../../../components/OutlinedButton";
import { useMutation, useQuery } from "@apollo/client";
import {
  UPDATE_EMAIL,
  UPDATE_PHONE_NUMBER,
  UPDATE_PASSWORD,
} from "../../../../utils/mutations";
import { GET_USER_CONTACT_INFORMATION } from "../../../../utils/queries";
import { formStyles, headerStyles, layoutStyles } from "../../../../styles";

export default function EditContact() {
  const { loading, error, data } = useQuery(GET_USER_CONTACT_INFORMATION);
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [changesMade, setChangesMade] = useState(false);

  const [updateEmailMutation] = useMutation(UPDATE_EMAIL);
  const [updatePhoneNumberMutation] = useMutation(UPDATE_PHONE_NUMBER);
  const [updatePasswordMutation] = useMutation(UPDATE_PASSWORD);

  useEffect(() => {
    if (data) {
      const { getUserContactInformation } = data;
      setEmail(getUserContactInformation.email);
      setPhoneNumber(getUserContactInformation.phoneNumber);
    }
  }, [data]);

  useEffect(() => {
    const passwordFieldsFilled =
      currentPassword !== "" &&
      newPassword !== "" &&
      confirmNewPassword !== "" &&
      newPassword === confirmNewPassword;
    setChangesMade(
      email !== data?.getUserContactInformation.email ||
        phoneNumber !== data?.getUserContactInformation.phoneNumber ||
        passwordFieldsFilled
    );
  }, [
    email,
    phoneNumber,
    currentPassword,
    newPassword,
    confirmNewPassword,
    data,
  ]);

  const handleUpdateContact = async () => {
    try {
      if (email !== data.getUserContactInformation.email && email !== "") {
        const { data: emailData } = await updateEmailMutation({
          variables: { email },
        });
        setEmail(emailData.updateEmail.email);
      }
      if (
        phoneNumber !== data.getUserContactInformation.phoneNumber &&
        phoneNumber !== ""
      ) {
        const { data: phoneData } = await updatePhoneNumberMutation({
          variables: { phoneNumber },
        });
        setPhoneNumber(phoneData.updatePhoneNumber.phoneNumber);
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
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setChangesMade(false);
    } catch (error) {
      console.error("Failed to update contact information", error);
    }
  };

  const discardChanges = () => {
    if (data) {
      const { getUserContactInformation } = data;
      setEmail(getUserContactInformation.email || "");
      setPhoneNumber(getUserContactInformation.phoneNumber || "");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setChangesMade(false);
    }
  };

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error! {error.message}</Text>;

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
