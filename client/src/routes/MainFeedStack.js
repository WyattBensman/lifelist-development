import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MainFeed from "../pages/MainFeed/Screens/MainFeed";
import Logbook from "../pages/Logbook/Screens/Logbook";
import Inbox from "../pages/Inbox/Screens/Inbox";
import FriendRequest from "../pages/Inbox/Screens/FriendRequest";
import Conversation from "../pages/Inbox/Screens/Conversation";

const Stack = createNativeStackNavigator();

export default function MainFeedStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#000000",
        },
      }}
    >
      <Stack.Screen
        name="MainFeedHome"
        component={MainFeed}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Logbook"
        component={Logbook}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Inbox"
        component={Inbox}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="FriendRequest"
        component={FriendRequest}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Conversation"
        component={Conversation}
        options={{ headerShown: false }}
      />
      {/* <Stack.Screen
        name="CreateCollage"
        component={CreateCollageScreen}
        options={{ headerShown: false }}
      /> */}
    </Stack.Navigator>
  );
}
