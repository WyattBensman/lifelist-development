import { ApolloProvider } from "@apollo/client";
import { client } from "./index";
import { NavigationProvider } from "./src/contexts/NavigationContext";
import { AuthProvider } from "./src/contexts/AuthContext";
import AppNavigator from "./AppNavigator";
import { CallbackProvider } from "./src/contexts/CallbackContext";

export default function App() {
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <CallbackProvider>
          <NavigationProvider>
            <AppNavigator />
          </NavigationProvider>
        </CallbackProvider>
      </AuthProvider>
    </ApolloProvider>
  );
}
