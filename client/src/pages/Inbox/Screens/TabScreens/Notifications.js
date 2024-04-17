import { ScrollView, View } from "react-native";
import { layoutStyles } from "../../../../styles";
import NotificationCard from "../../Cards/NotificationCard";
import FriendRequestCount from "../../Cards/FriendRequestCount";

/* Convert the Notifications into a Flatlist of Notification Cards */
export default function Notifications() {
  return (
    <View style={layoutStyles.wrapper}>
      <FriendRequestCount />
      <ScrollView style={layoutStyles.paddingTopXs}>
        <NotificationCard />
        <NotificationCard />
        <NotificationCard />
        <NotificationCard />
        <NotificationCard />
      </ScrollView>
    </View>
  );
}
