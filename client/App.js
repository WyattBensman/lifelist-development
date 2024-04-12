import { NavigationProvider } from "./src/utils/NavigationContext";
import NavigationTab from "./src/routes/NavigationTab";

export default function App() {
  return (
    <NavigationProvider>
      <NavigationTab />
    </NavigationProvider>
  );
}
