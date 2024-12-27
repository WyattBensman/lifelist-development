import { Pressable, Text, View } from "react-native";
import BottomPopup from "../PopUp";
import { menuStyles, symbolStyles } from "../../../styles";
import { useAuth } from "../../../contexts/AuthContext";
import { clearAllCaches } from "../../utils/caching/cacheHelpers";
import Icon from "../../icons/Icon";

export default function AdminProfileOptions({
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
      <View style={menuStyles.popupContainer}>
        <Text style={[menuStyles.header, menuStyles.popupText]}>
          Profile Options
        </Text>
        <Pressable
          style={[menuStyles.cardContainer, menuStyles.flex]}
          onPress={() => handleNavigate("EditProfile")}
        >
          <View style={menuStyles.flexRow}>
            <Icon name="person.circle" style={symbolStyles.popupIcon} />
            <Text style={[menuStyles.spacer, menuStyles.popupText]}>
              Edit Profile
            </Text>
          </View>
          <Icon
            name="chevron.forward"
            style={symbolStyles.forwardArrow}
            weight="semibold"
          />
        </Pressable>
        <Pressable
          style={[menuStyles.cardContainer, menuStyles.flex]}
          onPress={() =>
            handleNavigate("EditProfile", { initialTab: "Settings" })
          }
        >
          <View style={menuStyles.flexRow}>
            <Icon name="gearshape.circle" style={symbolStyles.popupIcon} />
            <Text style={[menuStyles.spacer, menuStyles.popupText]}>
              Settings
            </Text>
          </View>
          <Icon
            name="chevron.forward"
            style={symbolStyles.forwardArrow}
            weight="semibold"
          />
        </Pressable>
        <Pressable
          style={[menuStyles.cardContainer, menuStyles.flex]}
          onPress={() => handleNavigate("Saved")}
        >
          <View style={menuStyles.flexRow}>
            <Icon name="bookmark.circle" style={symbolStyles.popupIcon} />
            <Text style={[menuStyles.spacer, menuStyles.popupText]}>Saved</Text>
          </View>
          <Icon
            name="chevron.forward"
            style={symbolStyles.forwardArrow}
            weight="semibold"
          />
        </Pressable>
        <Pressable
          style={[menuStyles.cardContainer, menuStyles.flex]}
          onPress={() => handleNavigate("Tagged")}
        >
          <View style={menuStyles.flexRow}>
            <Icon name="tag.circle" style={symbolStyles.popupIcon} />
            <Text style={[menuStyles.spacer, menuStyles.popupText]}>
              Tagged
            </Text>
          </View>
          <Icon
            name="chevron.forward"
            style={symbolStyles.forwardArrow}
            weight="semibold"
          />
        </Pressable>
        <Pressable
          style={[menuStyles.cardContainer, menuStyles.flex]}
          onPress={() => handleNavigate("Archived")}
        >
          <View style={menuStyles.flexRow}>
            <Icon name="archivebox.circle" style={symbolStyles.popupIcon} />
            <Text style={[menuStyles.spacer, menuStyles.popupText]}>
              Archived
            </Text>
          </View>
          <Icon
            name="chevron.forward"
            style={symbolStyles.forwardArrow}
            weight="semibold"
          />
        </Pressable>
        <Pressable
          style={[menuStyles.cardContainer, menuStyles.flex]}
          onPress={() =>
            handleNavigate("CameraStack", { screen: "CameraRoll" })
          }
        >
          <View style={menuStyles.flexRow}>
            <Icon name="camera.circle" style={symbolStyles.popupIcon} />
            <Text style={[menuStyles.spacer, menuStyles.popupText]}>
              Camera Roll
            </Text>
          </View>
          <Icon
            name="chevron.forward"
            style={symbolStyles.forwardArrow}
            weight="semibold"
          />
        </Pressable>
        <Pressable
          style={[menuStyles.cardContainer, menuStyles.flex]}
          onPress={() =>
            handleNavigate("InviteFriends", { initialTab: "Invite" })
          }
        >
          <View style={menuStyles.flexRow}>
            <Icon name="envelope.circle" style={symbolStyles.popupIcon} />
            <Text style={[menuStyles.spacer, menuStyles.popupText]}>
              Invite Friends
            </Text>
          </View>
          <Icon
            name="chevron.forward"
            style={symbolStyles.forwardArrow}
            weight="semibold"
          />
        </Pressable>
        <View style={[menuStyles.cardContainer, menuStyles.flex]}>
          <View style={menuStyles.flexRow}>
            <Icon name="questionmark.circle" style={symbolStyles.popupIcon} />
            <Text style={[menuStyles.spacer, menuStyles.popupText]}>
              Support
            </Text>
          </View>
          <Icon
            name="chevron.forward"
            style={symbolStyles.forwardArrow}
            weight="semibold"
          />
        </View>
        <View style={[menuStyles.cardContainer, menuStyles.flex]}>
          <View style={menuStyles.flexRow}>
            <Icon name="info.circle" style={symbolStyles.popupIcon} />
            <Text style={[menuStyles.spacer, menuStyles.popupText]}>About</Text>
          </View>
          <Icon
            name="chevron.forward"
            style={symbolStyles.forwardArrow}
            weight="semibold"
          />
        </View>
        <Pressable
          onPress={handleLogout}
          style={[menuStyles.cardContainer, menuStyles.flex]}
        >
          <Text
            style={[menuStyles.spacer, { color: "#FF3B30", fontWeight: "600" }]}
          >
            Sign Out
          </Text>
        </Pressable>
      </View>
    </BottomPopup>
  );
}
