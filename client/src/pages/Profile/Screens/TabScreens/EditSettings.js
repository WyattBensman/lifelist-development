import { Pressable, StyleSheet, Text, View } from "react-native";
import {
  formStyles,
  headerStyles,
  iconStyles,
  layoutStyles,
} from "../../../../styles";
import { useState, useCallback } from "react";
import GlobalSwitch from "../../../../components/Switch";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import IconStatic from "../../../../components/Icons/IconStatic";
import EditProfileBottomContainer from "../../Components/EditProfileBottomContainer";
import { useAdminProfile } from "../../../../contexts/AdminProfileContext"; // Updated context
import DangerAlert from "../../../../components/Alerts/DangerAlert";

export default function EditSettings() {
  const navigation = useNavigation();
  const {
    adminProfile,
    updateAdminProfileField,
    saveAdminProfile,
    resetAdminChanges,
    unsavedChanges,
  } = useAdminProfile(); // Updated to use AdminProfileContext

  const [showAlert, setShowAlert] = useState(false);

  const handleBackPress = () => {
    if (unsavedChanges) {
      setShowAlert(true); // Show alert if there are unsaved changes
    } else {
      navigation.goBack(); // Navigate back immediately if no changes
    }
  };

  useFocusEffect(
    useCallback(() => {
      const handleBeforeRemove = (e) => {
        if (!unsavedChanges) {
          return;
        }
        e.preventDefault();
        setShowAlert(true); // Prevent navigation and show the alert
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
          Account Privacy
        </Text>
        <View style={[layoutStyles.flex, layoutStyles.marginBtmMd]}>
          <Text style={styles.text}>Private</Text>
          <GlobalSwitch
            isOn={adminProfile?.settings?.isProfilePrivate || false}
            onToggle={(value) =>
              updateAdminProfileField("settings", {
                ...adminProfile.settings,
                isProfilePrivate: value,
              })
            }
          />
        </View>
        <Pressable
          style={[layoutStyles.flex, layoutStyles.marginBtmLg]}
          onPress={() => navigation.navigate("BlockedUsers")}
        >
          <Text style={styles.text}>Blocked Users</Text>
          <IconStatic
            name="chevron.forward"
            noFill={true}
            weight={"semibold"}
            style={iconStyles.forwardArrow}
          />
        </Pressable>
        <Pressable
          style={layoutStyles.flex}
          onPress={() => navigation.navigate("PrivacyGroups")}
        >
          <Text style={styles.text}>Privacy Groups</Text>
          <IconStatic
            name="chevron.forward"
            noFill={true}
            weight={"semibold"}
            style={iconStyles.forwardArrow}
          />
        </Pressable>
        <Text
          style={[
            headerStyles.headerMedium,
            layoutStyles.marginTopLg,
            { marginBottom: 12 },
          ]}
        >
          General Settings
        </Text>
        <View>
          <View style={[layoutStyles.flex, layoutStyles.marginBtmMd]}>
            <Text style={styles.text}>Dark Mode</Text>
            <GlobalSwitch
              isOn={adminProfile?.settings?.darkMode || false}
              onToggle={(value) =>
                updateAdminProfileField("settings", {
                  ...adminProfile.settings,
                  darkMode: value,
                })
              }
            />
          </View>
          <Pressable
            style={[layoutStyles.flex, layoutStyles.marginBtmLg]}
            onPress={() => navigation.navigate("Notifications")}
          >
            <Text style={styles.text}>Notifications</Text>
            <IconStatic
              name="chevron.forward"
              noFill={true}
              weight={"semibold"}
              style={iconStyles.forwardArrow}
            />
          </Pressable>
          <Pressable
            style={layoutStyles.flex}
            onPress={() => navigation.navigate("Language")}
          >
            <Text style={styles.text}>Language</Text>
            <IconStatic
              name="chevron.forward"
              noFill={true}
              weight={"semibold"}
              style={iconStyles.forwardArrow}
            />
          </Pressable>
        </View>
      </View>
      {unsavedChanges && (
        <EditProfileBottomContainer
          saveChanges={saveAdminProfile} // Save changes via context
          discardChanges={resetAdminChanges} // Discard changes via context
        />
      )}

      {/* Danger Alert */}
      <DangerAlert
        visible={showAlert}
        onRequestClose={() => setShowAlert(false)}
        title="Unsaved Changes"
        message="You have unsaved changes. Are you sure you want to leave without saving?"
        onConfirm={() => {
          resetAdminChanges(); // Reset to original state
          setShowAlert(false); // Close the alert
          navigation.goBack(); // Navigate back
        }}
        onCancel={() => setShowAlert(false)} // Close the alert and stay
      />
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    color: "#ffffff",
    fontWeight: "500",
  },
});
