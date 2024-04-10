import { NavigationProvider } from "./src/utils/NavigationContext";
import NavigationTab from "./src/routes/NavigationTab";
import { ThemeProvider, useTheme } from "./src/utils/ThemeContext";

export default function App() {
  return (
    <ThemeProvider>
      <NavigationProvider>
        <NavigationTab />
      </NavigationProvider>
    </ThemeProvider>
  );
}
