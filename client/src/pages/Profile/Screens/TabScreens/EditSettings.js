import { Pressable, StyleSheet, Text, View } from "react-native";
import {
  formStyles,
  headerStyles,
  iconStyles,
  layoutStyles,
} from "../../../../styles";
import { useState, useEffect } from "react";
import BottomContainer from "../../../../components/BottomContainer";
import SolidButton from "../../../../components/SolidButton";
import OutlinedButton from "../../../../components/OutlinedButton";
import GlobalSwitch from "../../../../components/Switch";
import { useNavigation } from "@react-navigation/native";
import { useMutation, useQuery } from "@apollo/client";
import { UPDATE_SETTINGS } from "../../../../utils/mutations";
import { GET_USER_SETTINGS_INFORMATION } from "../../../../utils/queries";
import IconStatic from "../../../../components/Icons/IconStatic";

export default function EditSettings() {
  const navigation = useNavigation();
  const { loading, error, data } = useQuery(GET_USER_SETTINGS_INFORMATION);

  // Initialize state with empty values
  const [isPrivate, setIsPrivate] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [language, setLanguage] = useState("");
  const [notifications, setNotifications] = useState(false);
  const [changesMade, setChangesMade] = useState(false);

  const [updateSettingsMutation] = useMutation(UPDATE_SETTINGS);

  useEffect(() => {
    if (data) {
      const { getUserSettingsInformation } = data;
      setIsPrivate(getUserSettingsInformation.isProfilePrivate);
      setIsDarkMode(getUserSettingsInformation.darkMode);
      setLanguage(getUserSettingsInformation.language);
      setNotifications(getUserSettingsInformation.notifications);
    }
  }, [data]);

  useEffect(() => {
    if (data) {
      const { getUserSettingsInformation } = data;
      setChangesMade(
        isPrivate !== getUserSettingsInformation.isProfilePrivate ||
          isDarkMode !== getUserSettingsInformation.darkMode ||
          language !== getUserSettingsInformation.language ||
          notifications !== getUserSettingsInformation.notifications
      );
    }
  }, [isPrivate, isDarkMode, language, notifications, data]);

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

      // Manually update the values on the screen
      setIsPrivate(settingsData.updateSettings.isProfilePrivate);
      setIsDarkMode(settingsData.updateSettings.darkMode);
      setLanguage(settingsData.updateSettings.language);
      setNotifications(settingsData.updateSettings.notifications);

      setChangesMade(false);
    } catch (error) {
      console.error("Failed to update settings", error);
    }
  };

  const discardChanges = () => {
    if (data) {
      const { getUserSettingsInformation } = data;
      setIsPrivate(getUserSettingsInformation.isProfilePrivate);
      setIsDarkMode(getUserSettingsInformation.darkMode);
      setLanguage(getUserSettingsInformation.language);
      setNotifications(getUserSettingsInformation.notifications);
      setChangesMade(false);
    }
  };

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error! {error.message}</Text>;

  return (
    <View style={layoutStyles.wrapper}>
      <View style={formStyles.formContainer}>
        <Text style={[headerStyles.headerMedium, styles.text]}>
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
            styles.text,
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

const styles = StyleSheet.create({
  text: {
    color: "#ffffff",
    fontWeight: "500",
  },
});
