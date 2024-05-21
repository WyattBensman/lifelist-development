import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ExplorePage from "../pages/Explore/Screens/ExplorePage";
import ExploreHome from "../pages/Explore/Screens/ExploreHome";
import SharedProfileStack from "./SharedProfileStack";

const Stack = createNativeStackNavigator();

export default function ExploreStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ExploreHome"
        component={ExploreHome}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ExplorePage"
        component={ExplorePage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Profile"
        component={SharedProfileStack}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
