import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ReportOptionsScreen from "../pages/Collage/Screens/ReportOptionsScreen";

const Stack = createNativeStackNavigator();

export default function CollageStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#000000",
        },
      }}
    >
      <Stack.Screen
        name="ReportOptionsScreen"
        component={ReportOptionsScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
