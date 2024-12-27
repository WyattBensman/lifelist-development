import { ApolloProvider } from "@apollo/client";
import { client } from "./index";
import { NavigationProvider } from "./src/contexts/NavigationContext";
import { AuthProvider } from "./src/contexts/AuthContext";
import AppNavigator from "./AppNavigator";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ThemeProvider } from "@react-navigation/native";
import { theme } from "./src/styles/Theme";
import { LifeListExperienceProvider } from "./src/contexts/LifeListExperienceContext.js";
import { CreateProfileProvider } from "./src/contexts/CreateProfileContext.js";
import { CreateCollageProvider } from "./src/contexts/CreateCollageContext.js";
import { ProfileProvider } from "./src/contexts/ProfileContext.js";
import "react-native-gesture-handler";

export default function App() {
  return (
    <ApolloProvider client={client}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AuthProvider>
            <ThemeProvider theme={theme}>
              <ProfileProvider>
                <CreateProfileProvider>
                  <CreateCollageProvider>
                    <LifeListExperienceProvider>
                      <NavigationProvider>
                        <AppNavigator />
                      </NavigationProvider>
                    </LifeListExperienceProvider>
                  </CreateCollageProvider>
                </CreateProfileProvider>
              </ProfileProvider>
            </ThemeProvider>
        </AuthProvider>
      </GestureHandlerRootView>
    </ApolloProvider>
  );
}
