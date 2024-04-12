import { NavigationProvider } from "./src/utils/NavigationContext";
import NavigationTab from "./src/routes/NavigationTab";
import { ThemeProvider, useTheme } from "./src/utils/ThemeContext";

export default function App() {
  const theme = useTheme();

  return (
    <ThemeProvider theme={{ backgroundColor: "#ffffff" }}>
      <NavigationProvider>
        <NavigationTab />
      </NavigationProvider>
    </ThemeProvider>
  );
}
