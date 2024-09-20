import { Pressable, StyleSheet, Text, View } from "react-native";
import {
  formStyles,
  headerStyles,
  iconStyles,
  layoutStyles,
} from "../../../../styles";
import { useState, useEffect, useCallback } from "react";
import GlobalSwitch from "../../../../components/Switch";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useMutation, useQuery } from "@apollo/client";
import { UPDATE_SETTINGS } from "../../../../utils/mutations";
import { GET_USER_SETTINGS_INFORMATION } from "../../../../utils/queries";
import IconStatic from "../../../../components/Icons/IconStatic";
import EditProfileBottomContainer from "../../Components/EditProfileBottomContainer";
import CustomAlert from "../../../../components/Alerts/CustomAlert";

export default function EditSettings({
  setUnsavedChanges,
  registerResetChanges,
}) {
  const navigation = useNavigation();
  const { loading, error, data, refetch } = useQuery(
    GET_USER_SETTINGS_INFORMATION
  );

  const [isPrivate, setIsPrivate] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [language, setLanguage] = useState("");
  const [notifications, setNotifications] = useState(false);
  const [changesMade, setChangesMade] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const [updateSettingsMutation] = useMutation(UPDATE_SETTINGS);

  // Function to initialize or reset settings
  const initializeSettings = useCallback(() => {
    if (data) {
      const { getUserSettingsInformation } = data;
      setIsPrivate(getUserSettingsInformation.isProfilePrivate);
      setIsDarkMode(getUserSettingsInformation.darkMode);
      setLanguage(getUserSettingsInformation.language);
      setNotifications(getUserSettingsInformation.notifications);
    }
  }, [data]);

  // Register the resetChanges function with the navigator
  useEffect(() => {
    registerResetChanges(initializeSettings);
  }, [registerResetChanges, initializeSettings]);

  // Initialize settings when the data is fetched
  useEffect(() => {
    initializeSettings();
  }, [data, initializeSettings]);

  // Track changes in settings and notify the navigator if there are unsaved changes
  useEffect(() => {
    if (data) {
      const { getUserSettingsInformation } = data;
      const hasChanges =
        isPrivate !== getUserSettingsInformation.isProfilePrivate ||
        isDarkMode !== getUserSettingsInformation.darkMode ||
        language !== getUserSettingsInformation.language ||
        notifications !== getUserSettingsInformation.notifications;

      setChangesMade(hasChanges);
      setUnsavedChanges(hasChanges); // Notify parent (navigator) about unsaved changes
    }
  }, [isPrivate, isDarkMode, language, notifications, data, setUnsavedChanges]);

  const saveChanges = async () => {
    try {
      const { data: settingsData } = await updateSettingsMutation({
        variables: {
          isProfilePrivate: isPrivate,
          darkMode: isDarkMode,
          language: language,
          notifications: notifications,
        },
      });

      setIsPrivate(settingsData.updateSettings.isProfilePrivate);
      setIsDarkMode(settingsData.updateSettings.darkMode);
      setLanguage(settingsData.updateSettings.language);
      setNotifications(settingsData.updateSettings.notifications);

      setChangesMade(false);
      setUnsavedChanges(false);
    } catch (error) {
      console.error("Failed to update settings", error);
    }
  };

  const discardChanges = () => {
    initializeSettings(); // Reset to original values
    setChangesMade(false);
    setUnsavedChanges(false);
  };

  // Hook to handle when the user tries to navigate away from the screen
  useFocusEffect(
    useCallback(() => {
      const handleBeforeRemove = (e) => {
        if (!changesMade) {
          return;
        }

        e.preventDefault();
        setShowAlert(true);
      };

      navigation.addListener("beforeRemove", handleBeforeRemove);

      return () => {
        navigation.removeListener("beforeRemove", handleBeforeRemove);
      };
    }, [changesMade, navigation])
  );

  // Hook to reset the form when the user navigates back to this screen
  useFocusEffect(
    useCallback(() => {
      refetch(); // Refetch user settings data to ensure values are up-to-date
      initializeSettings(); // Reinitialize the form with original values
    }, [refetch, initializeSettings])
  );

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error! {error.message}</Text>;

  return (
    <View style={layoutStyles.wrapper}>
      <View style={formStyles.formContainer}>
        <Text style={[headerStyles.headerMedium, { marginBottom: 12 }]}>
          Account Privacy
        </Text>
        <View style={[layoutStyles.flex, layoutStyles.marginBtmMd]}>
          <Text style={styles.text}>Private</Text>
          <GlobalSwitch isOn={isPrivate} onToggle={setIsPrivate} />
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
            <GlobalSwitch isOn={isDarkMode} onToggle={setIsDarkMode} />
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
      {changesMade && (
        <EditProfileBottomContainer
          saveChanges={saveChanges}
          discardChanges={discardChanges}
        />
      )}

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
        onCancel={() => setShowAlert(false)} // Cancel and stay on the current page
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
