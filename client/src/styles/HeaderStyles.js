import { StyleSheet } from "react-native";
import { theme } from "../styles/Theme";

const { typography, colors, spacing } = theme;

export const headerStyles = StyleSheet.create({
  headerHeavy: {
    fontSize: typography.fontSizes.xl,
    fontWeight: typography.fontWeights.heavy,
    marginTop: spacing.sm,
    color: colors.fonts.LIGHTFONT,
  },
  headerMedium: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold,
    marginBottom: spacing.sm,
    color: colors.fonts.LIGHTFONT,
  },
  headerStandard: {
    fontSize: typography.fontSizes.md,
    marginBottom: spacing.md,
    color: colors.fonts.LIGHTFONT,
  },
});
