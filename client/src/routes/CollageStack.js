import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ReportOptionsScreen from "../pages/Collage/Screens/ReportOptionsScreen";
import EditMedia from "../pages/EditCollage/Screens/EditMedia";
import EditOverview from "../pages/EditCollage/Screens/EditOverview";
import EditCoverImage from "../pages/EditCollage/Screens/EditCoverImage";
import EditTaggedUsers from "../pages/EditCollage/Screens/EditTaggedUsers";
import EditPreview from "../pages/EditCollage/Screens/EditPreview";

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
      <Stack.Screen
        name="EditMedia"
        component={EditMedia}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EditOverview"
        component={EditOverview}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EditCoverImage"
        component={EditCoverImage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EditTaggedUsers"
        component={EditTaggedUsers}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EditPreview"
        component={EditPreview}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
