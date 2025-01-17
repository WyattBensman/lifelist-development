import React, { useEffect, useRef } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { layoutStyles } from "../../../styles/LayoutStyles";
import { useNavigation } from "@react-navigation/native";
import DownArrowIcon from "../Icons/DownArrowIcon";
import Icon from "../../../components/Icons/Icon";
import { iconStyles } from "../../../styles/iconStyles";
import DisposableCameraIcon from "../Icons/DisposableCameraIcon";
import OriginalCameraIcon from "../Icons/OriginalCameraIcon";
import FujiCameraIcon from "../Icons/FujiCameraIcon";

const IconFiller = () => <View style={{ width: 35, height: 35 }} />;

export default function Header({
  cameraType,
  onSelectCameraType,
  showOptions,
  onToggleOptions,
  shotsLeft,
}) {
  const navigation = useNavigation();
  const rotateArrowAnim = useRef(new Animated.Value(0)).current;
  const heightAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(rotateArrowAnim, {
      toValue: showOptions ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();

    Animated.timing(heightAnim, {
      toValue: showOptions ? 66 : 0,
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

  const handleSelectOption = (type) => {
    onSelectCameraType(type);
    onToggleOptions();
  };

  const getIconColor = (type) => (cameraType === type ? "#5FC4ED" : "#ffffff");

  return (
    <View
      style={[styles.mainContainer, showOptions && styles.expandedContainer]}
    >
      <View style={styles.contentContainer}>
        <View style={styles.sideContainer}>
          <Icon
            name="xmark"
            style={iconStyles.exit}
            onPress={handleExit}
            weight={"semibold"}
          />
          <IconFiller />
        </View>
        <View style={[styles.titleContainer, layoutStyles.flexRow]}>
          <Pressable onPress={onToggleOptions} style={styles.titlePressable}>
            <Text style={styles.header} numberOfLines={1} ellipsizeMode="tail">
              {cameraType}
            </Text>
            <Animated.View style={{ transform: [{ rotate: rotateArrow }] }}>
              <DownArrowIcon />
            </Animated.View>
          </Pressable>
        </View>
        <View style={styles.sideContainer}>
          <View style={styles.shotsLeftContainer}>
            {/* Show the number of shots left */}
            <Text style={styles.shotsLeftText}>{shotsLeft} Left</Text>
          </View>
        </View>
      </View>
      <Animated.View style={[styles.animatedContainer, { height: heightAnim }]}>
        {showOptions && (
          <View style={styles.optionsContainer}>
            <Pressable
              style={styles.optionContainer}
              onPress={() => handleSelectOption("Standard")}
            >
              <OriginalCameraIcon
                color={getIconColor("Standard")}
                onPress={() => handleSelectOption("Standard")}
              />
              <Text
                style={[
                  styles.option,
                  cameraType === "Standard" && styles.selectedOption,
                ]}
              >
                Standard
              </Text>
            </Pressable>
            <Pressable
              style={[styles.optionContainer, styles.centerOptionContainer]}
              onPress={() => handleSelectOption("Disposable")}
            >
              <DisposableCameraIcon
                color={getIconColor("Disposable")}
                onPress={() => handleSelectOption("Disposable")}
              />
              <Text
                style={[
                  styles.option,
                  cameraType === "Disposable" && styles.selectedOption,
                ]}
              >
                Disposable
              </Text>
            </Pressable>
            <Pressable
              style={styles.optionContainer}
              onPress={() => handleSelectOption("Fuji")}
            >
              <FujiCameraIcon
                color={getIconColor("Fuji")}
                onPress={() => handleSelectOption("Fuji")}
              />
              <Text
                style={[
                  styles.option,
                  cameraType === "Fuji" && styles.selectedOption,
                ]}
              >
                Fuji
              </Text>
            </Pressable>
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
    backgroundColor: "#121212",
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
    backgroundColor: "#252525",
    height: 35,
    borderRadius: 32,
    paddingRight: 12,
    paddingLeft: 22,
  },
  header: {
    fontWeight: "700",
    color: "#ffffff",
  },
  iconGap: {
    marginLeft: 20,
  },
  expandedContainer: {
    paddingBottom: 12,
  },
  animatedContainer: {
    overflow: "hidden",
  },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
  },
  optionContainer: {
    alignItems: "center",
    flex: 1,
  },
  centerOptionContainer: {
    justifyContent: "center",
    flex: 1,
  },
  option: {
    color: "#ffffff",
    paddingVertical: 2,
    fontSize: 12,
    fontWeight: "500",
  },
  selectedOption: {
    color: "#5FC4ED",
  },
  shotsLeftContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1C1C1C",
    borderRadius: 50,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  shotsLeftText: {
    color: "#696969", // Light grey text
    fontSize: 12,
    fontWeight: "500",
  },
});
