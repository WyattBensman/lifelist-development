import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MainFeed from "../pages/MainFeed/Screens/MainFeed";
import Logbook from "../pages/Logbook/Screens/Logbook";

const Stack = createNativeStackNavigator();

export default function MainFeedStack() {
  return (
    <Stack.Navigator>
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
    </Stack.Navigator>
  );
}

{
  /*         <Stack.Screen
          name="CreateCollage"
          component={CreateCollageScreen}
          options={{ headerShown: false }}
        /> */
}
{
  /*         <Stack.Screen
          name="Inbox"
          component={InboxScreen}
          options={{ headerShown: false }}
        /> */
}
