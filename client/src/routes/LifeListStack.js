import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ListView from "../pages/LifeList/Screens/ListView";
import LifeList from "../pages/LifeList/Screens/LifeList";
import ViewExperience from "../pages/LifeList/Screens/ViewExperience";

const Stack = createNativeStackNavigator();

export default function LifeListStack({ route }) {
  const { userId } = route.params;

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="LifeList"
        component={LifeList}
        initialParams={{ userId }}
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
    </Stack.Navigator>
  );
}
