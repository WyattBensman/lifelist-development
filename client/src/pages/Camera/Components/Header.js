import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { layoutStyles } from "../../../styles/LayoutStyles";
import { useNavigation } from "@react-navigation/native";
import ExitIcon from "../Icons/ExitIcon";
import FlashOutlineIcon from "../Icons/FlashOutlineIcon";
import FlashSolidIcon from "../Icons/FlashSolidIcon"; // Assuming you have this icon
import FlipCameraIcon from "../Icons/FlipCameraIcon";
import RotateCameraIcon from "../Icons/RotateCameraIcon";
import DownArrowIcon from "../Icons/DownArrowIcon";
import { Camera } from "expo-camera";

const IconFiller = () => <View style={{ width: 35, height: 35 }} />;

export default function Header({ flash, setFlash, type, setType }) {
  const navigation = useNavigation();

  const handleExit = () => {
    navigation.goBack(); // Navigate back to the previous screen
  };

  const toggleFlash = () => {
    setFlash(
      flash === Camera.Constants.FlashMode.off
        ? Camera.Constants.FlashMode.on
        : Camera.Constants.FlashMode.off
    );
  };

  const toggleCameraType = () => {
    setType(
      type === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  };

  return (
    <View style={[styles.mainContainer, styles.border]}>
      <View style={styles.contentContainer}>
        {/* Left Container */}
        <View style={styles.sideContainer}>
          <Pressable onPress={handleExit}>
            <ExitIcon />
          </Pressable>
          <IconFiller />
        </View>

        {/* Right Container */}
        <View style={[styles.sideContainer, styles.rightContainer]}>
          <Pressable onPress={toggleFlash}>
            {flash === Camera.Constants.FlashMode.off ? (
              <FlashOutlineIcon />
            ) : (
              <FlashSolidIcon />
            )}
          </Pressable>
          <View style={styles.iconGap}>
            <Pressable onPress={toggleCameraType}>
              <FlipCameraIcon />
            </Pressable>
          </View>
          <View style={styles.iconGap}>
            <RotateCameraIcon />
          </View>
        </View>

        {/* Title Container - Absolutely positioned */}
        <View style={[styles.titleContainer, layoutStyles.flexRow]}>
          <Text
            style={{ fontWeight: "700", fontSize: 12, color: "#ffffff" }}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            Disposable
          </Text>
          <DownArrowIcon />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    paddingTop: 60,
    paddingBottom: 2,
    backgroundColor: "#262828",
  },
  border: {
    borderBottomWidth: 1,
    borderBottomColor: "#D4D4D4",
  },
  contentContainer: {
    marginHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    position: "relative",
  },
  sideContainer: {
    flexDirection: "row",
    alignItems: "center",
    zIndex: 1,
  },
  rightContainer: {
    justifyContent: "flex-end",
  },
  titleContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Helvetica",
    color: "#6AB952",
  },
  iconGap: {
    marginLeft: 16,
  },
});
