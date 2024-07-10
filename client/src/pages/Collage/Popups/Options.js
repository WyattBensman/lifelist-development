import React from "react";
import {
  Text,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Alert,
} from "react-native";
import * as Sharing from "expo-sharing";
import * as Clipboard from "expo-clipboard";
import * as SMS from "expo-sms";
import { headerStyles, iconStyles } from "../../../styles";
import BottomPopup from "../../Profile/Popups/BottomPopup";
import Icon from "../../../components/Icons/Icon";
import IconLarge from "../../../components/Icons/IconLarge";
import Instagram from "../Icons/Instagram";
import Facebook from "../Icons/Facebook";
import { BASE_URL } from "../../../utils/config";
import { useNavigation } from "@react-navigation/native";

export default function Options({
  visible,
  onRequestClose,
  collageId,
  isSaved,
  handleSavePress,
}) {
  const navigation = useNavigation();
  const collageLink = `${BASE_URL}/collage/${collageId}`; // Construct the collage link

  const handleCopyLink = async () => {
    await Clipboard.setStringAsync(collageLink);
    Alert.alert("Link copied to clipboard");
  };

  const handleShareSMS = async () => {
    const isAvailable = await SMS.isAvailableAsync();
    if (isAvailable) {
      await SMS.sendSMSAsync([], collageLink);
    } else {
      Alert.alert("SMS is not available on this device");
    }
  };

  const handleShareInstagram = async () => {
    const isAvailable = await Sharing.isAvailableAsync();
    if (isAvailable) {
      await Sharing.shareAsync(collageLink, {
        dialogTitle: "Share to Instagram",
        mimeType: "text/plain",
      });
    } else {
      Alert.alert("Sharing is not available on this device");
    }
  };

  const handleShareFacebook = async () => {
    const isAvailable = await Sharing.isAvailableAsync();
    if (isAvailable) {
      await Sharing.shareAsync(collageLink, {
        dialogTitle: "Share to Facebook",
        mimeType: "text/plain",
      });
    } else {
      Alert.alert("Sharing is not available on this device");
    }
  };

  const handleReportPress = () => {
    onRequestClose();
    navigation.navigate("CollageStack", {
      screen: "ReportOptionsScreen",
      params: { collageId },
    });
  };

  return (
    <BottomPopup visible={visible} onRequestClose={onRequestClose} height={228}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.popupContainer}>
          <Text style={headerStyles.headerMedium}>Options</Text>
          <View style={[styles.separator, { marginBottom: 16 }]} />
          <View style={styles.contentContainer}>
            <View style={styles.buttonContainer}>
              <Pressable
                style={styles.topButtonContainerGreen}
                onPress={handleSavePress}
              >
                <Icon
                  name={isSaved ? "bookmark.fill" : "bookmark"}
                  style={iconStyles.bookmark}
                  noFill={!isSaved}
                  weight={"bold"}
                  tintColor={"#6AB952"}
                />
                <Text style={styles.topButtonTextGreen}>
                  {isSaved ? "Unsave" : "Save"}
                </Text>
              </Pressable>
              <Pressable
                style={styles.topButtonContainerRed}
                onPress={handleReportPress}
              >
                <Icon
                  name="flag"
                  style={iconStyles.bookmark}
                  noFill={true}
                  weight={"semibold"}
                  tintColor={"#E53935"}
                  onPress={handleReportPress}
                />
                <Text style={styles.topButtonTextRed}>Report</Text>
              </Pressable>
            </View>
            <View style={styles.shareContainer}>
              <Pressable style={styles.shareButton} onPress={handleShareSMS}>
                <IconLarge
                  name="message"
                  style={styles.shareIcon}
                  weight={"semibold"}
                  tintColor={"#ececec"}
                  onPress={handleShareSMS}
                />
                <Text style={styles.shareText}>SMS</Text>
              </Pressable>
              <Pressable style={styles.shareButton} onPress={handleCopyLink}>
                <IconLarge
                  name="link"
                  style={styles.shareIcon}
                  weight={"semibold"}
                  tintColor={"#ececec"}
                  onPress={handleCopyLink}
                />
                <Text style={styles.shareText}>Copy Link</Text>
              </Pressable>
              <Pressable
                style={styles.shareButton}
                onPress={handleShareInstagram}
              >
                <Instagram onPress={handleShareInstagram} />
                <Text style={styles.shareText}>Instagram</Text>
              </Pressable>
              <Pressable
                style={styles.shareButton}
                onPress={handleShareFacebook}
              >
                <Facebook onPress={handleShareFacebook} />
                <Text style={styles.shareText}>Facebook</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </BottomPopup>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  popupContainer: {
    flex: 1,
    padding: 16,
  },
  separator: {
    height: 1,
    backgroundColor: "#252525",
    marginBottom: 12,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "space-between",
    marginBottom: 32,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  topButtonContainerGreen: {
    flexDirection: "row",
    height: 35,
    width: "40%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#252525",
    borderRadius: 32,
  },
  topButtonTextGreen: {
    color: "#6AB952",
    fontWeight: "600",
  },
  topButtonContainerRed: {
    height: 35,
    width: "40%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#252525",
    borderRadius: 32,
  },
  topButtonTextRed: {
    color: "#E53935",
    fontWeight: "600",
    marginLeft: 4,
  },
  shareContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  shareButton: {
    alignItems: "center",
  },
  shareText: {
    fontSize: 12,
    marginTop: 4,
    color: "#ececec",
    fontWeight: "500",
  },
});
