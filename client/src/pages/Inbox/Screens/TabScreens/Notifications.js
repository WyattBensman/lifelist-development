import { View } from "react-native";
import NotificationCard from "../../Cards/NotificationCard";
import FriendRequestCount from "../../Cards/FriendRequestCount";
import { layoutStyles } from "../../../../styles";

/* Convert the Notifications into a Flatlist of Notification Cards */
export default function Notifications() {
  return (
    <View style={layoutStyles.container}>
      <FriendRequestCount />
      <NotificationCard />
      <NotificationCard />
      <NotificationCard />
      <NotificationCard />
      <NotificationCard />
    </View>
  );
}
