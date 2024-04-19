import { Pressable, StyleSheet, Text, View } from "react-native";
import { formStyles, headerStyles, layoutStyles } from "../../../../styles";
import { useState } from "react";
import BottomContainer from "../../../../components/BottomContainer";
import SolidButton from "../../../../components/SolidButton";
import OutlinedButton from "../../../../components/OutlinedButton";
import ForwardArrowIcon from "../../../../icons/Universal/ForwardArrowIcon";
import GlobalSwitch from "../../../../components/Switch";
import { useNavigation } from "@react-navigation/native";

export default function EditSettings() {
  const [isPrivate, setIsPrivate] = useState(false);
  const [isRepostToMainFeed, setIsRepostToMainFeed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigation = useNavigation();

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
        <View style={layoutStyles.flex}>
          <Text>Privacy Groups</Text>
          <ForwardArrowIcon />
        </View>
        <Text style={[headerStyles.headerMedium, layoutStyles.marginTopLg]}>
          General Settings
        </Text>
        <View>
          <View style={[layoutStyles.flex, layoutStyles.marginBtmMd]}>
            <Text>Dark Mode</Text>
            <GlobalSwitch isOn={isDarkMode} onToggle={setIsDarkMode} />
          </View>
          <View style={[layoutStyles.flex, layoutStyles.marginBtmLg]}>
            <Text>Notifications</Text>
            <ForwardArrowIcon />
          </View>
          <View style={layoutStyles.flex}>
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

{
  /*           <View style={[layoutStyles.flex, { borderWidth: 1 }]}>
            <Text>Post Repost to Main Feed</Text>
            <GlobalSwitch
              isOn={isRepostToMainFeed}
              onToggle={setIsRepostToMainFeed}
            />
          </View> */
}

const styles = StyleSheet.create({
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
