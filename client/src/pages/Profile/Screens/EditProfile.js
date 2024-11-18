import React, { useState } from "react";
import { View } from "react-native";
import { iconStyles, layoutStyles } from "../../../styles";
import EditProfileNavigator from "../Navigators/EditProfileNavigator";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import HeaderStack from "../../../components/Headers/HeaderStack";
import { useNavigationContext } from "../../../contexts/NavigationContext";
import Icon from "../../../components/Icons/Icon";
import CustomAlert from "../../../components/Alerts/CustomAlert";
import { useProfile } from "../../../contexts/ProfileContext";

export default function EditProfile() {
  const navigation = useNavigation();
  const { setIsTabBarVisible } = useNavigationContext();
  const { unsavedChanges, resetChanges } = useProfile();
  const [showAlert, setShowAlert] = useState(false);

  useFocusEffect(() => {
    setIsTabBarVisible(false);
  });

  console.log("Navigating back from:", navigation.getState());

  const handleBackPress = () => {
    if (unsavedChanges) {
      setShowAlert(true); // Show alert if there arekk unsaved changes
    } else {
      navigation.goBack(); // Navigate back if there are no changes
    }
  };

  const handleDiscardChanges = () => {
    resetChanges(); // Reset changes to the original state
    setShowAlert(false);
    navigation.goBack(); // Navigate back
  };

  return (
    <View style={layoutStyles.wrapper}>
      <HeaderStack
        arrow={
          <Icon
            name="chevron.backward"
            onPress={handleBackPress}
            style={iconStyles.backArrow}
            weight="semibold"
          />
        }
        title={"Edit Profile"}
        hasBorder={false}
      />
      <EditProfileNavigator />

      {/* Custom Alert for unsaved changes */}
      <CustomAlert
        visible={showAlert}
        title="Unsaved Changes"
        message="You have unsaved changes. Are you sure you want to discard them and leave?"
        onConfirm={handleDiscardChanges} // Discard changes and navigate back
        onCancel={() => setShowAlert(false)} // Close the alert without discarding changes
      />
    </View>
  );
}
