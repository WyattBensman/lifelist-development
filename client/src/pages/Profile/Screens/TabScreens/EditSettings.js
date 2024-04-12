import { StyleSheet, Text, View } from "react-native";
import { headerStyles, layoutStyles } from "../../../../styles";
import { useState } from "react";
import BottomContainer from "../../../../components/BottomContainer";
import SolidButton from "../../../../components/SolidButton";
import OutlinedButton from "../../../../components/OutlinedButton";
import ForwardArrowIcon from "../../../../icons/Universal/ForwardArrowIcon";
import GlobalSwitch from "../../../../components/Switch";

export default function EditSettings() {
  const [isPrivate, setIsPrivate] = useState(false);
  const [isRepostToMainFeed, setIsRepostToMainFeed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <View style={layoutStyles.container}>
      <View style={[layoutStyles.contentContainer, { marginTop: 24 }]}>
        <Text style={styles.inputLabel}>Account Privacy</Text>
        <View style={styles.indentContainer}>
          <View style={[layoutStyles.flex, styles.inputSpacer]}>
            <Text>Private</Text>
            <GlobalSwitch isOn={isPrivate} onToggle={setIsPrivate} />
          </View>
          <View style={[layoutStyles.flex, styles.inputSpacer]}>
            <Text>Blocked User</Text>
            <ForwardArrowIcon />
          </View>
          <View style={[layoutStyles.flex, styles.inputSpacer]}>
            <Text>Privacy Groups</Text>
            <ForwardArrowIcon />
          </View>
          <View style={[layoutStyles.flex, styles.inputSpacer]}>
            <Text>Post Repost to Main Feed</Text>
            <GlobalSwitch
              isOn={isRepostToMainFeed}
              onToggle={setIsRepostToMainFeed}
            />
          </View>
        </View>
        <Text style={[styles.inputLabel, { marginTop: 16 }]}>
          General Settings
        </Text>
        <View style={styles.indentContainer}>
          <View style={[layoutStyles.flex, styles.inputSpacer]}>
            <Text>Dark Mode</Text>
            <GlobalSwitch isOn={isDarkMode} onToggle={setIsDarkMode} />
          </View>
          <View style={[layoutStyles.flex, styles.inputSpacer]}>
            <Text>Notifications</Text>
            <ForwardArrowIcon />
          </View>
          <View style={[layoutStyles.flex, styles.inputSpacer]}>
            <Text>Language</Text>
            <ForwardArrowIcon />
          </View>
        </View>
      </View>
      {/* <BottomContainer
        topButton={
          <SolidButton
            backgroundColor={"#d4d4d4"}
            text={"Save Changes"}
            textColor={"#ffffff"}
          />
        }
        bottomButton={
          <OutlinedButton borderColor={"#d4d4d4"} text={"Discard"} />
        }
      /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  indentContainer: {
    marginLeft: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    marginBottom: 4,
    fontWeight: "500",
  },
  inputSpacer: {
    marginVertical: 4,
    paddingVertical: 4,
  },
  input: {
    height: 40,
    borderWidth: 1,
    padding: 10,
    borderRadius: 4,
    borderColor: "#D4D4D4",
  },
  switchStyle: {
    transform: [{ scale: 0.7 }],
  },
});
