import { useEffect, useRef, useState } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { layoutStyles } from "../../../styles/LayoutStyles";
import { useNavigation } from "@react-navigation/native";
import ExitIcon from "../Icons/ExitIcon";
import FlashOutlineIcon from "../Icons/FlashOutlineIcon";
import FlashSolidIcon from "../Icons/FlashSolidIcon";
import FlipCameraIcon from "../Icons/FlipCameraIcon";
import RotateCameraIcon from "../Icons/RotateCameraIcon";
import DownArrowIcon from "../Icons/DownArrowIcon";

const IconFiller = () => <View style={{ width: 35, height: 35 }} />;

export default function Header({
  toggleFlash,
  toggleCameraFacing,
  toggleShotOrientation,
  flash,
  rotation,
  cameraType,
  onSelectCameraType,
}) {
  const navigation = useNavigation();
  const [showOptions, setShowOptions] = useState(false);
  const rotateArrowAnim = useRef(new Animated.Value(0)).current;
  const heightAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(rotateArrowAnim, {
      toValue: showOptions ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();

    Animated.timing(heightAnim, {
      toValue: showOptions ? 45 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [showOptions]);

  const rotateArrow = rotateArrowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "-180deg"],
  });

  const handleExit = () => {
    navigation.goBack();
  };

  const handleToggleOptions = () => {
    setShowOptions((prev) => !prev);
  };

  const handleSelectOption = (type) => {
    onSelectCameraType(type);
    setShowOptions(false);
  };

  return (
    <View
      style={[styles.mainContainer, showOptions && styles.expandedContainer]}
    >
      <View style={styles.contentContainer}>
        <View style={styles.sideContainer}>
          <Pressable onPress={handleExit} style={{ zIndex: 1 }}>
            <ExitIcon handleExit={handleExit} />
          </Pressable>
          <IconFiller />
        </View>

        <View style={[styles.sideContainer, styles.rightContainer]}>
          {!showOptions && (
            <>
              <Animated.View style={{ transform: [{ rotate: rotation }] }}>
                <Pressable onPress={toggleFlash}>
                  {flash === "off" ? <FlashOutlineIcon /> : <FlashSolidIcon />}
                </Pressable>
              </Animated.View>
              <Animated.View style={{ transform: [{ rotate: rotation }] }}>
                <Pressable onPress={toggleCameraFacing} style={styles.iconGap}>
                  <FlipCameraIcon />
                </Pressable>
              </Animated.View>
              {/* <Animated.View style={{ transform: [{ rotate: rotation }] }}>
                <Pressable
                  onPress={toggleShotOrientation}
                  style={styles.iconGap}
                >
                  <RotateCameraIcon />
                </Pressable>
              </Animated.View> */}
            </>
          )}
        </View>

        <View style={[styles.titleContainer, layoutStyles.flexRow]}>
          <Pressable
            onPress={handleToggleOptions}
            style={styles.titlePressable}
          >
            <Text style={styles.header} numberOfLines={1} ellipsizeMode="tail">
              {cameraType}
            </Text>
            <Animated.View style={{ transform: [{ rotate: rotateArrow }] }}>
              <DownArrowIcon />
            </Animated.View>
          </Pressable>
        </View>
      </View>
      <Animated.View style={[styles.animatedContainer, { height: heightAnim }]}>
        {showOptions && (
          <View style={styles.optionsContainer}>
            <Text
              style={[
                styles.option,
                cameraType === "Disposable" && styles.selectedOption,
              ]}
              onPress={() => handleSelectOption("Disposable")}
            >
              Disposable
            </Text>
            <Text
              style={[
                styles.option,
                cameraType === "Fuji" && styles.selectedOption,
              ]}
              onPress={() => handleSelectOption("Fuji")}
            >
              Fuji
            </Text>
            <Text
              style={[
                styles.option,
                cameraType === "Polaroid" && styles.selectedOption,
              ]}
              onPress={() => handleSelectOption("Polaroid")}
            >
              Polaroid
            </Text>
          </View>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    paddingTop: 60,
    paddingBottom: 10,
    backgroundColor: "#262828",
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
  titlePressable: {
    flexDirection: "row",
    alignItems: "center",
  },
  header: {
    fontSize: 16,
    fontWeight: "700",
    color: "#ffffff",
  },
  iconGap: {
    marginLeft: 20,
  },
  expandedContainer: {
    paddingBottom: 12,
  },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
  },
  option: {
    color: "#ffffff",
    paddingVertical: 5,
  },
  selectedOption: {
    color: "#5FC4ED",
  },
});
