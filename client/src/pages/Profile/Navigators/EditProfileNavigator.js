import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, Pressable, Dimensions } from "react-native";
import EditProfile from "../Screens/TabScreens/EditProfile";
import EditContact from "../Screens/TabScreens/EditContact";
import EditSettings from "../Screens/TabScreens/EditSettings";
import { useRoute } from "@react-navigation/native";
import { layoutStyles } from "../../../styles";
import Animated, {
  Easing,
  useSharedValue,
  withTiming,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useAdminProfile } from "../../../contexts/AdminProfileContext";
import DangerAlert from "../../../components/Alerts/DangerAlert";

const { width } = Dimensions.get("window");

const tabs = [
  { name: "Profile", component: EditProfile },
  { name: "Contact", component: EditContact },
  { name: "Settings", component: EditSettings },
];

export default function EditProfileNavigator() {
  const { unsavedChanges, resetAdminChanges } = useAdminProfile();
  const route = useRoute();
  const initialTab = route.params?.initialTab || "Profile";
  const [activeTab, setActiveTab] = useState(initialTab);
  const [pendingTab, setPendingTab] = useState(null); // Track the tab the user is trying to switch to
  const [showAlert, setShowAlert] = useState(false); // Control alert visibility
  const translateX = useSharedValue(0);
  const resetChangesRef = useRef({}); // Store resetChanges functions for each tab

  useEffect(() => {
    if (route.params?.initialTab) {
      setActiveTab(route.params.initialTab);
    }
  }, [route.params?.initialTab]);

  useEffect(() => {
    translateX.value = tabs.findIndex((tab) => tab.name === activeTab) * -width;
  }, [activeTab, translateX]);

  const handleTabPress = (tabName) => {
    if (unsavedChanges) {
      // If there are unsaved changes, show the alert before switching tabs
      setPendingTab(tabName);
      setShowAlert(true);
    } else {
      // No unsaved changes, allow immediate tab switch
      setActiveTab(tabName);
    }
  };

  const handleDiscardChanges = () => {
    resetAdminChanges(); // Reset unsaved changes globally
    setActiveTab(pendingTab); // Switch to the new tab
    setShowAlert(false); // Close the alert
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: withTiming(translateX.value, {
          duration: 300,
          easing: Easing.inOut(Easing.ease),
        }),
      },
    ],
  }));

  const renderScreen = () => {
    return tabs.map((tab) => (
      <View key={tab.name} style={styles.screen}>
        {React.createElement(tab.component, {
          registerResetChanges: (resetFn) => {
            resetChangesRef.current[tab.name] = resetFn;
          },
        })}
      </View>
    ));
  };

  return (
    <View style={layoutStyles.wrapper}>
      <View style={styles.navigatorWrapper}>
        {tabs.map((tab) => (
          <Pressable
            key={tab.name}
            style={[
              styles.navigatorButton,
              activeTab === tab.name && styles.activeNavigatorButton,
            ]}
            onPress={() => handleTabPress(tab.name)}
          >
            <Text
              style={[
                styles.navigatorText,
                activeTab === tab.name && styles.activeNavigatorText,
              ]}
            >
              {tab.name}
            </Text>
          </Pressable>
        ))}
      </View>
      <Animated.View style={[styles.screenContainer, animatedStyle]}>
        {renderScreen()}
      </Animated.View>

      {/* Danger Alert */}
      <DangerAlert
        visible={showAlert}
        onRequestClose={() => setShowAlert(false)}
        title="Unsaved Changes"
        message="You have unsaved changes. Are you sure you want to leave without saving?"
        onConfirm={handleDiscardChanges} // Discard changes and switch tabs
        onCancel={() => setShowAlert(false)} // Cancel and stay on the current tab
      />
    </View>
  );
}

const styles = StyleSheet.create({
  navigatorWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    paddingBottom: 12,
    paddingTop: 6,
    marginBottom: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: "#252525",
  },
  navigatorButton: {
    width: "26%",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 6,
    backgroundColor: "#1C1C1C",
    borderWidth: 1,
    borderColor: "transparent",
  },
  activeNavigatorButton: {
    backgroundColor: "#6AB95230",
    borderWidth: 1,
    borderColor: "#6AB95250",
  },
  navigatorText: {
    color: "#696969",
    fontWeight: "500",
  },
  activeNavigatorText: {
    color: "#6AB952",
    fontWeight: "500",
  },
  screenContainer: {
    flexDirection: "row",
    width: width * tabs.length,
    flex: 1,
  },
  screen: {
    width: width,
    flex: 1,
  },
});
