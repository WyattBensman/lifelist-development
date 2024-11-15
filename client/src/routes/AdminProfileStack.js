import { createNativeStackNavigator } from "@react-navigation/native-stack";
import EditProfile from "../pages/Profile/Screens/EditProfile";
import Saved from "../pages/Profile/Screens/Saved";
import Archived from "../pages/Profile/Screens/Archived";
import BlockedUsers from "../pages/Profile/Screens/BlockedUsers";
import PrivacyGroups from "../pages/Profile/Screens/PrivacyGroups";
import PrivacyGroup from "../pages/Profile/Screens/PrivacyGroup";
import AdminProfile from "../pages/Profile/Screens/AdminProfile";
import ProfileStack from "./ProfileStack";
import NavigationTab from "./NavigationTab";
import ViewCollage from "../pages/Collage/Screens/ViewCollage";
import CameraStack from "./CameraStack";
import AddUsersToPrivacyGroup from "../pages/Profile/Screens/AddUsersToPrivacyGroup";
import CreatePrivacyGroup from "../pages/Profile/Screens/CreatePrivacyGroup";
import InviteFriends from "../pages/Profile/Screens/InviteFriends";
import Tagged from "../pages/Profile/Screens/Tagged";

const Stack = createNativeStackNavigator();

export default function AdminProfileStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#000000",
        },
      }}
    >
      <Stack.Screen
        name="AdminProfile"
        component={AdminProfile}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProfileStack"
        component={ProfileStack}
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
        name="Tagged"
        component={Tagged}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Archived"
        component={Archived}
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
        name="AddUsersToPrivacyGroup"
        component={AddUsersToPrivacyGroup}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CreatePrivacyGroup"
        component={CreatePrivacyGroup}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="BlockedUsers"
        component={BlockedUsers}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="NavigationTabStack"
        component={NavigationTab}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ViewCollage"
        component={ViewCollage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CameraStack"
        component={CameraStack}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="InviteFriends"
        component={InviteFriends}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
