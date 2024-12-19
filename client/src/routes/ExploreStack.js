import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ExplorePage from "../pages/Explore/Screens/ExplorePage";
import ExploreHome from "../pages/Explore/Screens/ExploreHome";
import Explore from "../pages/Explore/Screens/Explore";
import ProfileStack from "./ProfileStack";

const Stack = createNativeStackNavigator();

export default function ExploreStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ExploreHome"
        component={Explore}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ExplorePage"
        component={ExplorePage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProfileStack"
        component={ProfileStack}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
