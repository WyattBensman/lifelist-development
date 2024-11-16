import { ApolloProvider } from "@apollo/client";
import { client } from "./index";
import { NavigationProvider } from "./src/contexts/NavigationContext";
import { AuthProvider } from "./src/contexts/AuthContext";
import AppNavigator from "./AppNavigator";
import { CallbackProvider } from "./src/contexts/CallbackContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ThemeProvider } from "@react-navigation/native";
import { theme } from "./src/styles/theme.js";
import { LifeListExperienceProvider } from "./src/contexts/LifeListExperienceContext.js";
import { CollageProvider } from "./src/contexts/CollageContext.js";
import "react-native-gesture-handler";
import { CreateProfileProvider } from "./src/contexts/CreateProfileContext.js";
import { ProfileProvider } from "./src/contexts/ProfileContext.js";

export default function App() {
  return (
    <ApolloProvider client={client}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AuthProvider>
          <CallbackProvider>
            <ThemeProvider theme={theme}>
              <ProfileProvider>
                <CreateProfileProvider>
                  <CollageProvider>
                    <LifeListExperienceProvider>
                      <NavigationProvider>
                        <AppNavigator />
                      </NavigationProvider>
                    </LifeListExperienceProvider>
                  </CollageProvider>
                </CreateProfileProvider>
              </ProfileProvider>
            </ThemeProvider>
          </CallbackProvider>
        </AuthProvider>
      </GestureHandlerRootView>
    </ApolloProvider>
  );
}
