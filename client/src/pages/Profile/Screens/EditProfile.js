import React, { useState } from "react";
import { View } from "react-native";
import { iconStyles, layoutStyles } from "../../../styles";
import EditProfileNavigator from "../Navigators/EditProfileNavigator";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import HeaderStack from "../../../components/Headers/HeaderStack";
import { useNavigationContext } from "../../../contexts/NavigationContext";
import Icon from "../../../components/Icons/Icon";
import CustomAlert from "../../../components/Alerts/CustomAlert";
import { useAdminProfile } from "../../../contexts/AdminProfileContext";

export default function EditProfile() {
  const navigation = useNavigation();
  const { setIsTabBarVisible } = useNavigationContext();
  const { unsavedChanges, resetAdminChanges } = useAdminProfile(); // Updated to use AdminProfileContext
  const [showAlert, setShowAlert] = useState(false);

  useFocusEffect(() => {
    setIsTabBarVisible(false);
  });

  const handleBackPress = () => {
    if (unsavedChanges) {
      setShowAlert(true); // Show alert if there are unsaved changes
    } else {
      navigation.goBack(); // Navigate back if there are no changes
    }
  };

  const handleDiscardChanges = () => {
    resetAdminChanges(); // Reset changes to the original state
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
