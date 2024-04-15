import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Profile from "../pages/Profile/Screens/Profile";
import WorldMap from "../pages/Profile/Screens/WorldMap";
import ViewLifeList from "../pages/Profile/Screens/ViewLifeList";
import UserRelations from "../pages/Profile/Screens/UserRelations";
import EditProfile from "../pages/Profile/Screens/EditProfile";
import Saved from "../pages/Profile/Screens/Saved";
import Archived from "../pages/Profile/Screens/Archived";
import EditFlowPage from "../pages/Profile/Screens/EditFlowPage";
import BlockedUsers from "../pages/Profile/Screens/BlockedUsers";
import PrivacyGroups from "../pages/Profile/Screens/PrivacyGroups";
import PrivacyGroup from "../pages/Profile/Screens/PrivacyGroup";

const Stack = createNativeStackNavigator();

export default function ProfileStack() {
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
      <Stack.Screen
        name="EditProfile"
        component={EditProfile}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Saved"
        component={Saved}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Archived"
        component={Archived}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EditFlowPage"
        component={EditFlowPage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PrivacyGroups"
        component={PrivacyGroups}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PrivacyGroup"
        component={PrivacyGroup}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EditPrivacyGroup"
        component={PrivacyGroup}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="BlockedUsers"
        component={BlockedUsers}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
