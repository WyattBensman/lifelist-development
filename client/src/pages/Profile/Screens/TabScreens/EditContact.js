import React, { useState } from "react";
import { Text, TextInput, View, StyleSheet } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { formStyles, headerStyles, layoutStyles } from "../../../../styles";
import EditProfileBottomContainer from "../../Components/EditProfileBottomContainer";
import CustomAlert from "../../../../components/Alerts/CustomAlert";
import { useProfile } from "../../../../contexts/ProfileContext";

export default function EditContact() {
  const navigation = useNavigation();
  const {
    profile,
    updateProfileField,
    saveProfile,
    resetChanges,
    unsavedChanges,
  } = useProfile();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const handleBackPress = () => {
    if (unsavedChanges) {
      setShowAlert(true);
    } else {
      navigation.goBack();
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      const handleBeforeRemove = (e) => {
        if (!unsavedChanges) {
          return;
        }
        e.preventDefault();
        setShowAlert(true);
      };

      navigation.addListener("beforeRemove", handleBeforeRemove);

      return () => {
        navigation.removeListener("beforeRemove", handleBeforeRemove);
      };
    }, [unsavedChanges, navigation])
  );

  return (
    <View style={layoutStyles.wrapper}>
      <View style={formStyles.formContainer}>
        <Text style={[headerStyles.headerMedium, { marginBottom: 12 }]}>
          Contact Information
        </Text>
        <View style={styles.row}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            value={profile?.email || ""}
            onChangeText={(value) => updateProfileField("email", value)}
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor="#d4d4d4"
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Phone</Text>
          <TextInput
            value={profile?.phone || ""}
            onChangeText={(value) => updateProfileField("phone", value)}
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
        {unsavedChanges && (
          <EditProfileBottomContainer
            saveChanges={saveProfile}
            discardChanges={resetChanges}
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
          resetChanges();
          setShowAlert(false);
          navigation.goBack();
        }}
        onCancel={() => setShowAlert(false)}
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
