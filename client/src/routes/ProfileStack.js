import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WorldMap from "../pages/Profile/Screens/WorldMap";
import UserRelations from "../pages/Profile/Screens/UserRelations";
import Profile from "../pages/Profile/Screens/Profile";
import LifeListStack from "./LifeListStack";
import ViewCollage from "../pages/Collage/Screens/ViewCollage";

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
        name="LifeListStack"
        component={LifeListStack}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ViewCollage"
        component={ViewCollage}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
