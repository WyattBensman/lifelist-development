import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Profile from "../pages/Profile/Screens/Profile";
import WorldMap from "../pages/Profile/Screens/WorldMap";
import ViewLifeList from "../pages/Profile/Screens/ViewLifeList";
import UserRelations from "../pages/Profile/Screens/UserRelations";
import EditProfile from "../pages/Profile/Screens/EditProfile";

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
    </Stack.Navigator>
  );
}
