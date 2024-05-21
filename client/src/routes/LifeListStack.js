import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LifeList from "../pages/LifeList/Screens/LifeList";
import ListView from "../pages/LifeList/Screens/ListView";
import AddExperiencesSearch from "../pages/LifeList/Screens/AddExperiencesSearch";
import AddExperiencesOverview from "../pages/LifeList/Screens/AddExperiencesOverview";
import ManageShots from "../pages/LifeList/Screens/ManageShots";
import ManageCollages from "../pages/LifeList/Screens/ManageCollages";
import UpdateShots from "../pages/LifeList/Screens/UpdateShots";

const Stack = createNativeStackNavigator();

export default function LifeListStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="LifeList"
        component={LifeList}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ListView"
        component={ListView}
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
