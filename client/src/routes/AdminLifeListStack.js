import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AddExperiencesSearch from "../pages/LifeList/Screens/AddExperiencesSearch";
import AddExperiencesOverview from "../pages/LifeList/Screens/AddExperiencesOverview";
import ManageShots from "../pages/LifeList/Screens/ManageShots";
import ManageCollages from "../pages/LifeList/Screens/ManageCollages";
import UpdateShots from "../pages/LifeList/Screens/UpdateShots";
import AdminLifeList from "../pages/LifeList/Screens/AdminLifeList";
import LifeListStack from "./LifeListStack";
import ManageTempShots from "../pages/LifeList/Screens/ManageTempShots";

const Stack = createNativeStackNavigator();

export default function AdminLifeListStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AdminLifeList"
        component={AdminLifeList}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="LifeListStack"
        component={LifeListStack}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddExperiences"
        component={AddExperiencesSearch}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddExperiencesOverview"
        component={AddExperiencesOverview}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ManageTempShots"
        component={ManageTempShots}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ManageShots"
        component={ManageShots}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ManageCollages"
        component={ManageCollages}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="UpdateShots"
        component={UpdateShots}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
