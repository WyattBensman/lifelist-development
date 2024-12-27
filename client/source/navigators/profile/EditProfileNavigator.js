import React, { useState, useEffect, useRef } from "react";
import { View, Text, Pressable } from "react-native";
import EditProfile from "../Screens/TabScreens/EditProfile";
import EditContact from "../Screens/TabScreens/EditContact";
import EditSettings from "../Screens/TabScreens/EditSettings";
import { useRoute } from "@react-navigation/native";
import Animated, {
  Easing,
  useSharedValue,
  withTiming,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useAdminProfile } from "../../../contexts/AdminProfileContext";
import DangerAlert from "../../../components/Alerts/DangerAlert";
import { navigatorStyles } from "../styles/navigatorStyles";

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
    translateX.value =
      tabs.findIndex((tab) => tab.name === activeTab) *
      -navigatorStyles.screenContainer.width;
  }, [activeTab]);

  const handleTabPress = (tabName) => {
    if (unsavedChanges) {
      setPendingTab(tabName);
      setShowAlert(true);
    } else {
      setActiveTab(tabName);
    }
  };

  const handleDiscardChanges = () => {
    resetAdminChanges();
    setActiveTab(pendingTab);
    setShowAlert(false);
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
      <View key={tab.name} style={navigatorStyles.screen}>
        {React.createElement(tab.component, {
          registerResetChanges: (resetFn) => {
            resetChangesRef.current[tab.name] = resetFn;
          },
        })}
      </View>
    ));
  };

  return (
    <View style={navigatorStyles.wrapper}>
      <View style={navigatorStyles.editProfileNavigatorWrapper}>
        {tabs.map((tab) => (
          <Pressable
            key={tab.name}
            style={[
              navigatorStyles.navigatorButton,
              navigatorStyles.editProfileNavigatorButton,
              activeTab === tab.name && navigatorStyles.activeNavigatorButton,
            ]}
            onPress={() => handleTabPress(tab.name)}
          >
            <Text
              style={[
                navigatorStyles.navigatorText,
                activeTab === tab.name && navigatorStyles.activeNavigatorText,
              ]}
            >
              {tab.name}
            </Text>
          </Pressable>
        ))}
      </View>
      <Animated.View style={[navigatorStyles.screenContainer, animatedStyle]}>
        {renderScreen()}
      </Animated.View>

      <DangerAlert
        visible={showAlert}
        onRequestClose={() => setShowAlert(false)}
        title="Unsaved Changes"
        message="You have unsaved changes. Are you sure you want to leave without saving?"
        onConfirm={handleDiscardChanges}
        onCancel={() => setShowAlert(false)}
      />
    </View>
  );
}
