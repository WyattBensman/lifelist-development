import { Pressable, StyleSheet, Text, View } from "react-native";
import { formStyles, headerStyles, layoutStyles } from "../../../../styles";
import { useState, useEffect } from "react";
import BottomContainer from "../../../../components/BottomContainer";
import SolidButton from "../../../../components/SolidButton";
import OutlinedButton from "../../../../components/OutlinedButton";
import ForwardArrowIcon from "../../../../icons/Universal/ForwardArrowIcon";
import GlobalSwitch from "../../../../components/Switch";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../../../contexts/AuthContext";
import { useMutation } from "@apollo/client";
import { UPDATE_SETTINGS } from "../../../../utils/mutations";

export default function EditSettings() {
  const navigation = useNavigation();
  const { currentUser, updateCurrentUser } = useAuth();

  // Initialize state with current user settings
  const [isPrivate, setIsPrivate] = useState(
    currentUser.settings.isProfilePrivate
  );
  const [isDarkMode, setIsDarkMode] = useState(currentUser.settings.darkMode);
  const [language, setLanguage] = useState(currentUser.settings.language);
  const [notifications, setNotifications] = useState(
    currentUser.settings.notifications
  );
  const [changesMade, setChangesMade] = useState(false);

  const [updateSettingsMutation] = useMutation(UPDATE_SETTINGS);

  useEffect(() => {
    setChangesMade(
      isPrivate !== currentUser.settings.isProfilePrivate ||
        isDarkMode !== currentUser.settings.darkMode ||
        language !== currentUser.settings.language ||
        notifications !== currentUser.settings.notifications
    );
  }, [isPrivate, isDarkMode, language, notifications, currentUser]);

  const saveChanges = async () => {
    try {
      const { data } = await updateSettingsMutation({
        variables: {
          isProfilePrivate: isPrivate,
          darkMode: isDarkMode,
          language: language,
          notifications: notifications,
        },
      });

      updateCurrentUser({
        settings: {
          isProfilePrivate: data.updateSettings.isProfilePrivate,
          darkMode: data.updateSettings.darkMode,
          language: data.updateSettings.language,
          notifications: data.updateSettings.notifications,
        },
      });

      setChangesMade(false);
    } catch (error) {
      console.error("Failed to update settings", error);
    }
  };

  const discardChanges = () => {
    setIsPrivate(currentUser.settings.isProfilePrivate);
    setIsDarkMode(currentUser.settings.darkMode);
    setLanguage(currentUser.settings.language);
    setNotifications(currentUser.settings.notifications);
    setChangesMade(false);
  };

  return (
    <View style={layoutStyles.wrapper}>
      <View style={formStyles.formContainer}>
        <Text style={headerStyles.headerMedium}>Account Privacy</Text>
        <View style={[layoutStyles.flex, layoutStyles.marginBtmMd]}>
          <Text>Private</Text>
          <GlobalSwitch isOn={isPrivate} onToggle={setIsPrivate} />
        </View>
        <Pressable
          style={[layoutStyles.flex, layoutStyles.marginBtmLg]}
          onPress={() => navigation.navigate("BlockedUsers")}
        >
          <Text>Blocked Users</Text>
          <ForwardArrowIcon />
        </Pressable>
        <Pressable
          style={layoutStyles.flex}
          onPress={() => navigation.navigate("PrivacyGroups")}
        >
          <Text>Privacy Groups</Text>
          <ForwardArrowIcon />
        </Pressable>
        <Text style={[headerStyles.headerMedium, layoutStyles.marginTopLg]}>
          General Settings
        </Text>
        <View>
          <View style={[layoutStyles.flex, layoutStyles.marginBtmMd]}>
            <Text>Dark Mode</Text>
            <GlobalSwitch isOn={isDarkMode} onToggle={setIsDarkMode} />
          </View>
          <Pressable
            style={[layoutStyles.flex, layoutStyles.marginBtmLg]}
            onPress={() => navigation.navigate("Notifications")}
          >
            <Text>Notifications</Text>
            <ForwardArrowIcon />
          </Pressable>
          <Pressable
            style={layoutStyles.flex}
            onPress={() => navigation.navigate("Language")}
          >
            <Text>Language</Text>
            <ForwardArrowIcon />
          </Pressable>
        </View>
      </View>
      {changesMade && (
        <BottomContainer
          topButton={
            <SolidButton
              backgroundColor={"#6AB952"}
              text={"Save Changes"}
              textColor={"#ffffff"}
              onPress={saveChanges}
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
  );
}
