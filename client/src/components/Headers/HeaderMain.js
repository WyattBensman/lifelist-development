import React, { useRef, useEffect } from "react";
import { StyleSheet, View, Animated, Text } from "react-native";
import { layoutStyles } from "../../styles";

const IconFiller = () => <View style={{ width: 35, height: 35 }} />;

export default function HeaderMain({
  titleComponent,
  icon1,
  icon2,
  icon3,
  dropdownVisible = false,
  dropdownContent = null,
}) {
  const dropdownHeight = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(dropdownHeight, {
      toValue: dropdownVisible ? 80 : 0, // Adjust the height as needed
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [dropdownVisible]);

  return (
    <View style={styles.headerContainer}>
      <View style={layoutStyles.flex}>
        <View style={[layoutStyles.flexRowCenter]}>
          {titleComponent ? titleComponent : <IconFiller />}
        </View>
        <IconFiller />
        <View style={layoutStyles.flexRowCenter}>
          {icon1 && (
            <View style={layoutStyles.alignJustifyCenter}>{icon1}</View>
          )}
          {icon2 && (
            <View
              style={[
                layoutStyles.alignJustifyCenter,
                layoutStyles.marginLeftMd,
              ]}
            >
              {icon2}
            </View>
          )}
          {icon3 && (
            <View
              style={[
                layoutStyles.alignJustifyCenter,
                layoutStyles.marginLeftMd,
              ]}
            >
              {icon3}
            </View>
          )}
        </View>
      </View>
      <Animated.View
        style={[styles.dropdownContainer, { height: dropdownHeight }]}
      >
        {dropdownVisible && dropdownContent}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: "#121212",
    paddingTop: 56,
    paddingBottom: 4,
    borderBottomWidth: 1,
    paddingHorizontal: 20,
    borderBottomColor: "#1C1C1C",
  },
  dropdownContainer: {
    overflow: "hidden",
    backgroundColor: "#121212",
  },
});
