import { Pressable, StyleSheet, Text, View } from "react-native";
import BottomPopup from "./BottomPopup";
import ForwardArrowIcon from "../../../icons/Universal/ForwardArrowIcon";
import { headerStyles, layoutStyles, popupStyles } from "../../../styles";
import EditProfile from "../Icons/PopupIcons/EditProfile";
import Saved from "../Icons/PopupIcons/Saved";
import Archived from "../Icons/PopupIcons/Archived";
import Logbook from "../Icons/PopupIcons/Logbook";
import CameraShots from "../Icons/PopupIcons/CameraShots";
import InviteFriends from "../Icons/PopupIcons/InviteFriends";
import About from "../Icons/PopupIcons/About";
import Settings from "../Icons/PopupIcons/Settings";
import Support from "../Icons/PopupIcons/Support";

export default function AdminOptionsPopup({
  visible,
  onRequestClose,
  navigation,
}) {
  const handleNavigate = (screen) => {
    navigation.navigate(screen);
    onRequestClose();
  };

  return (
    <BottomPopup visible={visible} onRequestClose={onRequestClose} height={540}>
      <View style={popupStyles.popupContainer}>
        <Text style={headerStyles.headerMedium}>Profile Options</Text>
        <View style={[popupStyles.cardContainer, layoutStyles.flex]}>
          <View style={layoutStyles.flexRow}>
            <EditProfile />
            <Text style={popupStyles.spacer}>Edit Profile</Text>
          </View>
          <ForwardArrowIcon />
        </View>
        <View style={[popupStyles.cardContainer, layoutStyles.flex]}>
          <View style={layoutStyles.flexRow}>
            <Settings />
            <Text style={popupStyles.spacer}>Settings</Text>
          </View>
          <ForwardArrowIcon />
        </View>
        <Pressable
          style={[popupStyles.cardContainer, layoutStyles.flex]}
          onPress={() => handleNavigate("Saved")}
        >
          <View style={layoutStyles.flexRow}>
            <Saved />
            <Text style={popupStyles.spacer}>Saved</Text>
          </View>
          <ForwardArrowIcon />
        </Pressable>
        <Pressable
          style={[popupStyles.cardContainer, layoutStyles.flex]}
          onPress={() => handleNavigate("Archived")}
        >
          <View style={layoutStyles.flexRow}>
            <Archived />
            <Text style={popupStyles.spacer}>Archived</Text>
          </View>
          <ForwardArrowIcon />
        </Pressable>
        <View style={[popupStyles.cardContainer, layoutStyles.flex]}>
          <View style={layoutStyles.flexRow}>
            <Logbook />
            <Text style={popupStyles.spacer}>Logbook</Text>
          </View>
          <ForwardArrowIcon />
        </View>
        <View style={[popupStyles.cardContainer, layoutStyles.flex]}>
          <View style={layoutStyles.flexRow}>
            <CameraShots />
            <Text style={popupStyles.spacer}>Camera Shots</Text>
          </View>
          <ForwardArrowIcon />
        </View>
        <View style={[popupStyles.cardContainer, layoutStyles.flex]}>
          <View style={layoutStyles.flexRow}>
            <CameraShots />
            <Text style={popupStyles.spacer}>Privacy Groups</Text>
          </View>
          <ForwardArrowIcon />
        </View>
        <View style={[popupStyles.cardContainer, layoutStyles.flex]}>
          <View style={layoutStyles.flexRow}>
            <InviteFriends />
            <Text style={popupStyles.spacer}>Invite Friends</Text>
          </View>
          <ForwardArrowIcon />
        </View>
        <View style={[popupStyles.cardContainer, layoutStyles.flex]}>
          <View style={layoutStyles.flexRow}>
            <Support />
            <Text style={popupStyles.spacer}>Support</Text>
          </View>
          <ForwardArrowIcon />
        </View>
        <View style={[popupStyles.cardContainer, layoutStyles.flex]}>
          <View style={layoutStyles.flexRow}>
            <About />
            <Text style={popupStyles.spacer}>About</Text>
          </View>
          <ForwardArrowIcon />
        </View>
        <View style={[popupStyles.cardContainer, layoutStyles.flex]}>
          <Text style={[popupStyles.spacer, { color: "red" }]}>Sign Out</Text>
        </View>
      </View>
    </BottomPopup>
  );
}