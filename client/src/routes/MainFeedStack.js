import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MainFeed from "../pages/MainFeed/Screens/MainFeed";
import Inbox from "../pages/Inbox/Screens/Inbox";
import FriendRequest from "../pages/Inbox/Screens/FriendRequest";
import Conversation from "../pages/Inbox/Screens/Conversation";
import Media from "../pages/CreateCollage/Screens/Media";
import Overview from "../pages/CreateCollage/Screens/Overview";
import Preview from "../pages/CreateCollage/Screens/Preview";
import ProfileStack from "./ProfileStack";
import SearchNewConversation from "../pages/Inbox/Screens/SearchNewConversation";

const Stack = createNativeStackNavigator();

export default function MainFeedStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#000000",
        },
        cardStyle: { backgroundColor: "#ffffff" },
      }}
    >
      <Stack.Screen
        name="MainFeedHome"
        component={MainFeed}
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
      <Stack.Screen
        name="SearchNewConversation"
        component={SearchNewConversation}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CreateCollage"
        component={Media}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CollageOverview"
        component={Overview}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CollagePreview"
        component={Preview}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProfileStack"
        component={ProfileStack}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
