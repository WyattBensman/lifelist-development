import NavigationTab from "./src/routes/NavigationTab";
import AuthenticationStack from "./src/routes/AuthenticationStack";
import { NavigationContainer } from "@react-navigation/native";

export default function AuthenticatedApp() {
  return (
    <NavigationContainer>
      {/* {user ? <NavigationTab /> : <AuthenticationStack />} */}
    </NavigationContainer>
  );
}

/* const { user, setUser } = useUser();

useEffect(() => {
  const checkLoginStatus = async () => {
    const loggedIn = await AuthService.loggedIn();
    console.log(loggedIn);
    if (loggedIn) {
      const userInfo = await AuthService.getUser();
      setUser(userInfo);
    }
  };

  checkLoginStatus();
}, [setUser]); */
