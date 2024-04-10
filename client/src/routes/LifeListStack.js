import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LifeList from "../pages/LifeList/Screens/LifeList";
import ListView from "../pages/LifeList/Screens/ListView";

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
        name="Listview"
        component={ListView}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
