import React from "react";
import {
  Text,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from "react-native";
import { headerStyles, iconStyles } from "../../../styles";
import BottomPopup from "../../Profile/Popups/BottomPopup";
import Icon from "../../../components/Icons/Icon";
import IconLarge from "../../../components/Icons/IconLarge";

export default function Options({ visible, onRequestClose, collageId }) {
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
              <Pressable style={styles.topButtonContainerGreen}>
                <Icon
                  name="bookmark"
                  style={iconStyles.bookmark}
                  noFill={true}
                  weight={"bold"}
                  tintColor={"#6AB952"}
                />
                <Text style={styles.topButtonTextGreen}>Save</Text>
              </Pressable>
              <Pressable style={styles.topButtonContainerRed}>
                <Icon
                  name="flag"
                  style={iconStyles.bookmark}
                  noFill={true}
                  weight={"semibold"}
                  tintColor={"#E53935"}
                />
                <Text style={styles.topButtonTextRed}>Report</Text>
              </Pressable>
            </View>
            {/* <View style={[styles.separator, { marginTop: 15 }]} /> */}
            <View style={styles.shareContainer}>
              <View style={styles.shareButton}>
                <IconLarge
                  name="message"
                  style={styles.shareIcon}
                  weight={"semibold"}
                  tintColor={"#ececec"}
                />
                <Text style={styles.shareText}>SMS</Text>
              </View>
              <View style={styles.shareButton}>
                <IconLarge
                  name="link"
                  style={styles.shareIcon}
                  weight={"semibold"}
                  tintColor={"#ececec"}
                />
                <Text style={styles.shareText}>Copy Link</Text>
              </View>
              <View style={styles.shareButton}>
                <IconLarge
                  name="message"
                  style={styles.shareIcon}
                  weight={"semibold"}
                  tintColor={"#ececec"}
                />
                <Text style={styles.shareText}>Instagram</Text>
              </View>
              <View style={styles.shareButton}>
                <IconLarge
                  name="link"
                  style={styles.shareIcon}
                  weight={"semibold"}
                  tintColor={"#ececec"}
                />
                <Text style={styles.shareText}>Facebook</Text>
              </View>
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
