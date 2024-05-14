import { ApolloProvider } from "@apollo/client";
import { client } from "./index";
import { NavigationProvider } from "./src/contexts/NavigationContext";
import { AuthProvider } from "./src/contexts/AuthContext";
import AppNavigator from "./AppNavigator";

export default function App() {
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <NavigationProvider>
          <AppNavigator />
        </NavigationProvider>
      </AuthProvider>
    </ApolloProvider>
  );
}
