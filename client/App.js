import { ApolloProvider } from "@apollo/client";
import { client } from "./index";
import { NavigationProvider } from "./src/utils/NavigationContext";
import { UserProvider } from "./src/contexts/UserContext";

export default function App() {
  return (
    <ApolloProvider client={client}>
      <UserProvider>
        <NavigationProvider>{/* <AuthenticatedApp /> */}</NavigationProvider>
      </UserProvider>
    </ApolloProvider>
  );
}

/* const [loading, setLoading] = useState(true);

useEffect(() => {
  AuthService.loggedIn().then((loggedIn) => {
    setLoading(false);
  });
}, []);

if (loading) {
  return <LoadingScreen />;
} */
