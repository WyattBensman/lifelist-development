import { Pressable, Text, View } from "react-native";
import LifeListLogo from "../Icons/LifeListLogo";
import CreateCollageIcon from "../Icons/CreateCollageIcon";
import InboxIcon from "../Icons/InboxIcon";
import { layoutStyles } from "../../../styles";
import HeaderMain from "../../../components/Headers/HeaderMain";
import { useAuth } from "../../../contexts/AuthContext";
import { useNavigation } from "@react-navigation/native";

export default function MainFeed() {
  const { logout, currentUser } = useAuth();
  const navigation = useNavigation();

  const navigateToUserProfile = () => {
    navigation.navigate("Profile", { userId: "663a3133e0ffbeff092b81db" });
  };

  return (
    <View style={layoutStyles.wrapper}>
      <HeaderMain
        titleComponent={<LifeListLogo />}
        icon1={<CreateCollageIcon />}
        icon3={<InboxIcon />}
      />
      <Pressable onPress={logout}>
        <Text style={{ margin: 20 }}>Logout</Text>
      </Pressable>
      {/* Display User Information */}
      <Text>{`Full Name: ${currentUser?.fullName}`}</Text>
      <Text>{`Username: ${currentUser?.username}`}</Text>
      {/* Navigating to a specific user's profile */}
      <Pressable onPress={navigateToUserProfile}>
        <Text style={{ color: "blue", margin: 20 }}>Go to User Profile</Text>
      </Pressable>
    </View>
  );
}
