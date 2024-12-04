import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ListView from "../pages/LifeList/Screens/ListView";
import LifeList from "../pages/LifeList/Screens/LifeList";
import ViewExperience from "../pages/LifeList/Screens/ViewExperience";
import ViewExperienceShot from "../pages/LifeList/Screens/ViewExperienceShot";

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
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ViewExperience"
        component={ViewExperience}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ViewExperienceShot"
        component={ViewExperienceShot}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
