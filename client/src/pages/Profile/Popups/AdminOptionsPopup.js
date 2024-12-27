import { Pressable, StyleSheet, Text, View } from "react-native";
import BottomPopup from "./BottomPopup";
import {
  headerStyles,
  iconStyles,
  layoutStyles,
  popupStyles,
} from "../../../styles";
import { useAuth } from "../../../contexts/AuthContext";
import IconStatic from "../../../components/Icons/IconStatic";
import { clearAllCaches } from "../../../utils/cacheHelper";

export default function AdminOptionsPopup({
  visible,
  onRequestClose,
  navigation,
}) {
  const handleNavigate = (screen, params) => {
    navigation.navigate(screen, params);
    onRequestClose();
  };
  const { logout } = useAuth();

  const handleLogout = async () => {
    await clearAllCaches();
    logout();
  };

  return (
    <BottomPopup visible={visible} onRequestClose={onRequestClose} height={508}>
      <View style={popupStyles.popupContainer}>
        <Text style={[headerStyles.headerMedium, styles.text]}>
          Profile Options
        </Text>
        <Pressable
          style={[popupStyles.cardContainer, layoutStyles.flex]}
          onPress={() => handleNavigate("EditProfile")}
        >
          <View style={layoutStyles.flexRow}>
            <IconStatic name="person.circle" style={iconStyles.popupIcon} />
            <Text style={[popupStyles.spacer, styles.text]}>Edit Profile</Text>
          </View>
          <IconStatic
            name="chevron.forward"
            style={iconStyles.forwardArrow}
            weight={"semibold"}
          />
        </Pressable>
        <Pressable
          style={[popupStyles.cardContainer, layoutStyles.flex]}
          onPress={() =>
            handleNavigate("EditProfile", { initialTab: "Settings" })
          }
        >
          <View style={layoutStyles.flexRow}>
            <IconStatic name="gearshape.circle" style={iconStyles.popupIcon} />
            <Text style={[popupStyles.spacer, styles.text]}>Settings</Text>
          </View>
          <IconStatic
            name="chevron.forward"
            style={iconStyles.forwardArrow}
            weight={"semibold"}
          />
        </Pressable>
        <Pressable
          style={[popupStyles.cardContainer, layoutStyles.flex]}
          onPress={() => handleNavigate("Saved")}
        >
          <View style={layoutStyles.flexRow}>
            <IconStatic name="bookmark.circle" style={iconStyles.popupIcon} />
            <Text style={[popupStyles.spacer, styles.text]}>Saved</Text>
          </View>
          <IconStatic
            name="chevron.forward"
            style={iconStyles.forwardArrow}
            weight={"semibold"}
          />
        </Pressable>
        <Pressable
          style={[popupStyles.cardContainer, layoutStyles.flex]}
          onPress={() => handleNavigate("Tagged")}
        >
          <View style={layoutStyles.flexRow}>
            <IconStatic name="bookmark.circle" style={iconStyles.popupIcon} />
            <Text style={[popupStyles.spacer, styles.text]}>Tagged</Text>
          </View>
          <IconStatic
            name="chevron.forward"
            style={iconStyles.forwardArrow}
            weight={"semibold"}
          />
        </Pressable>
        <Pressable
          style={[popupStyles.cardContainer, layoutStyles.flex]}
          onPress={() => handleNavigate("Archived")}
        >
          <View style={layoutStyles.flexRow}>
            <IconStatic name="archivebox.circle" style={iconStyles.popupIcon} />
            <Text style={[popupStyles.spacer, styles.text]}>Archived</Text>
          </View>
          <IconStatic
            name="chevron.forward"
            style={iconStyles.forwardArrow}
            weight={"semibold"}
          />
        </Pressable>
        <Pressable
          style={[popupStyles.cardContainer, layoutStyles.flex]}
          onPress={() =>
            handleNavigate("CameraStack", { screen: "CameraRoll" })
          }
        >
          <View style={layoutStyles.flexRow}>
            <IconStatic name="camera.circle" style={iconStyles.popupIcon} />
            <Text style={[popupStyles.spacer, styles.text]}>Camera Roll</Text>
          </View>
          <IconStatic
            name="chevron.forward"
            style={iconStyles.forwardArrow}
            weight={"semibold"}
          />
        </Pressable>
        <Pressable
          style={[popupStyles.cardContainer, layoutStyles.flex]}
          onPress={() =>
            handleNavigate("InviteFriends", { initialTab: "Invite" })
          }
        >
          <View style={layoutStyles.flexRow}>
            <IconStatic name="envelope.circle" style={iconStyles.popupIcon} />
            <Text style={[popupStyles.spacer, styles.text]}>
              Invite Friends
            </Text>
          </View>
          <IconStatic
            name="chevron.forward"
            style={iconStyles.forwardArrow}
            weight={"semibold"}
          />
        </Pressable>
        <View style={[popupStyles.cardContainer, layoutStyles.flex]}>
          <View style={layoutStyles.flexRow}>
            <IconStatic
              name="questionmark.circle"
              style={iconStyles.popupIcon}
            />
            <Text style={[popupStyles.spacer, styles.text]}>Support</Text>
          </View>
          <IconStatic
            name="chevron.forward"
            style={iconStyles.forwardArrow}
            weight={"semibold"}
          />
        </View>
        <View style={[popupStyles.cardContainer, layoutStyles.flex]}>
          <View style={layoutStyles.flexRow}>
            <IconStatic name="info.circle" style={iconStyles.popupIcon} />
            <Text style={[popupStyles.spacer, styles.text]}>About</Text>
          </View>
          <IconStatic
            name="chevron.forward"
            style={iconStyles.forwardArrow}
            weight={"semibold"}
          />
        </View>
        <Pressable
          onPress={handleLogout}
          style={[popupStyles.cardContainer, layoutStyles.flex]}
        >
          <Text
            style={[
              popupStyles.spacer,
              { color: "#FF3B30", fontWeight: "600" },
            ]}
          >
            Sign Out
          </Text>
        </Pressable>
      </View>
    </BottomPopup>
  );
}

const styles = StyleSheet.create({
  text: {
    color: "#ffffff",
  },
});
