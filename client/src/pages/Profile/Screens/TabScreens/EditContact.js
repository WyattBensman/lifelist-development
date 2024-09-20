import React, { useState, useEffect, useCallback } from "react";
import { Text, TextInput, View, StyleSheet, Alert } from "react-native";
import { useMutation, useQuery } from "@apollo/client";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import {
  UPDATE_EMAIL,
  UPDATE_PHONE_NUMBER,
  UPDATE_PASSWORD,
} from "../../../../utils/mutations";
import { GET_USER_CONTACT_INFORMATION } from "../../../../utils/queries";
import { formStyles, headerStyles, layoutStyles } from "../../../../styles";
import EditProfileBottomContainer from "../../Components/EditProfileBottomContainer";
import CustomAlert from "../../../../components/Alerts/CustomAlert";

export default function EditContact({
  setUnsavedChanges,
  registerResetChanges,
}) {
  const { loading, error, data, refetch } = useQuery(
    GET_USER_CONTACT_INFORMATION
  );
  const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [changesMade, setChangesMade] = useState(false);
  const [showAlert, setShowAlert] = useState(false); // Control the visibility of the alert

  const [updateEmailMutation] = useMutation(UPDATE_EMAIL);
  const [updatePhoneNumberMutation] = useMutation(UPDATE_PHONE_NUMBER);
  const [updatePasswordMutation] = useMutation(UPDATE_PASSWORD);

  // Function to initialize or reset contact data
  const initializeContactInfo = useCallback(() => {
    if (data) {
      const { getUserContactInformation } = data;
      setEmail(getUserContactInformation.email);
      setPhoneNumber(getUserContactInformation.phoneNumber);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    }
  }, [data]);

  // Register the resetChanges function with the navigator
  useEffect(() => {
    registerResetChanges(initializeContactInfo);
  }, [registerResetChanges, initializeContactInfo]);

  useEffect(() => {
    initializeContactInfo();
  }, [data, initializeContactInfo]);

  // Track changes in contact information and notify the parent (navigator) about unsaved changes
  useEffect(() => {
    const passwordFieldsFilled =
      currentPassword !== "" &&
      newPassword !== "" &&
      confirmNewPassword !== "" &&
      newPassword === confirmNewPassword;

    const hasChanges =
      email !== data?.getUserContactInformation.email ||
      phoneNumber !== data?.getUserContactInformation.phoneNumber ||
      passwordFieldsFilled;

    setChangesMade(hasChanges);
    setUnsavedChanges(hasChanges); // Update parent about unsaved changes
  }, [
    email,
    phoneNumber,
    currentPassword,
    newPassword,
    confirmNewPassword,
    data,
    setUnsavedChanges,
  ]);

  const saveChanges = async () => {
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
      setUnsavedChanges(false); // Reset unsaved changes state
    } catch (error) {
      console.error("Failed to update contact information", error);
    }
  };

  const discardChanges = () => {
    initializeContactInfo(); // Reset to original values
    setChangesMade(false);
    setUnsavedChanges(false); // Reset unsaved changes state
  };

  // Hook to handle when the user tries to navigate away from the screen
  useFocusEffect(
    useCallback(() => {
      const handleBeforeRemove = (e) => {
        if (!changesMade) {
          return; // If no changes are made, allow navigation.
        }

        // Prevent default behavior (navigation)
        e.preventDefault();

        // Show the custom alert
        setShowAlert(true);
      };

      // Attach listener when the component is in focus
      navigation.addListener("beforeRemove", handleBeforeRemove);

      return () => {
        // Cleanup the listener when the component is no longer focused
        navigation.removeListener("beforeRemove", handleBeforeRemove);
      };
    }, [changesMade, navigation])
  );

  // Refetch contact information when the user navigates back to this screen
  useFocusEffect(
    useCallback(() => {
      refetch(); // Refetch contact data to ensure values are up-to-date
      initializeContactInfo(); // Reinitialize form with original values
    }, [refetch, initializeContactInfo])
  );

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error! {error.message}</Text>;

  return (
    <View style={layoutStyles.wrapper}>
      <View style={formStyles.formContainer}>
        <Text style={[headerStyles.headerMedium, { marginBottom: 12 }]}>
          Contact Information
        </Text>
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
        <Text
          style={[
            headerStyles.headerMedium,
            layoutStyles.marginTopXs,
            { marginBottom: 12 },
          ]}
        >
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
          <EditProfileBottomContainer
            saveChanges={saveChanges}
            discardChanges={discardChanges}
          />
        )}
      </View>

      {/* Custom Alert */}
      <CustomAlert
        visible={showAlert}
        onRequestClose={() => setShowAlert(false)}
        title="Unsaved Changes"
        message="You have unsaved changes. Are you sure you want to leave without saving?"
        onConfirm={() => {
          setShowAlert(false);
          discardChanges(); // Revert changes to initial state
          navigation.goBack(); // Allow navigation
        }}
        onCancel={() => setShowAlert(false)} // Cancel and stay on the current screen
      />
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
    width: 76,
    color: "#fff",
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
  },
});
