import { View } from "react-native";
import NotificationCard from "../Cards/NotificationCard";
import FriendRequestCount from "../Cards/FriendRequestCount";
import { globalStyling } from "../../../styles/GlobalStyling";
import { useTheme } from "../../../utils/ThemeContext";

/* Convert the Notifications into a Flatlist of Notification Cards */
export default function Notifications() {
  const theme = useTheme();

  return (
    <View
      style={[
        globalStyling.container,
        { backgroundColor: theme.colors.background },
      ]}
    >
      <FriendRequestCount />
      <NotificationCard />
      <NotificationCard />
      <NotificationCard />
      <NotificationCard />
      <NotificationCard />
    </View>
  );
}
