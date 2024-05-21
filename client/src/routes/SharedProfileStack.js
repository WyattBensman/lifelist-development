import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Profile from "../pages/Profile/Screens/Profile";
import ViewLifeList from "../pages/Profile/Screens/ViewLifeList";
import WorldMap from "../pages/Profile/Screens/WorldMap";
import UserRelations from "../pages/Profile/Screens/UserRelations";
import EditProfile from "../pages/Profile/Screens/EditProfile";
import Saved from "../pages/Profile/Screens/Saved";
import Archived from "../pages/Profile/Screens/Archived";
import BlockedUsers from "../pages/Profile/Screens/BlockedUsers";
import PrivacyGroups from "../pages/Profile/Screens/PrivacyGroups";
import PrivacyGroup from "../pages/Profile/Screens/PrivacyGroup";

const Stack = createNativeStackNavigator();

export default function SharedProfileStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#000000",
        },
      }}
    >
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ViewLifeList"
        component={ViewLifeList}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="WorldMap"
        component={WorldMap}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="UserRelations"
        component={UserRelations}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
