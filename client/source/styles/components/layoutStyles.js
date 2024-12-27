import { StyleSheet } from "react-native";
import { SPACING } from "../globals";
import { useTheme } from "../../contexts/ThemeContext";

const { theme } = useTheme(); // Import the theme dynamically

export const layoutStyles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: theme.BACKGROUNDCOLOR, // Apply the theme's background color
  },
  contentContainer: {
    flex: 1,
    marginTop: SPACING.medium,
    marginHorizontal: SPACING.medium,
  },
});

export default layoutStyles;
