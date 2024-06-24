import { StyleSheet } from "react-native";
import { theme } from "./theme";

const { colors, spacing, borderRadii, typography } = theme;

export const navigatorStyles = StyleSheet.create({
  navigatorWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: colors.containers.BACKGROUND,
    paddingBottom: spacing.sm,
    paddingTop: spacing.sm,
    marginBottom: spacing.md,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.containers.SURFACE,
  },
  navigatorButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadii.md,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: spacing.xs,
    backgroundColor: colors.containers.ONBACKGROUND,
  },
  navigatorButtonSmall: {
    width: "26%",
  },
  navigatorButtonMedium: {
    width: "40%",
  },
  activeNavigatorButton: {
    backgroundColor: colors.containers.PRIMARY,
    borderWidth: 1,
    borderColor: colors.containers.PRIMARYBORDER,
  },
  navigatorText: {
    color: colors.fonts.DARKGREYFONT,
    fontWeight: typography.fontWeights.medium,
  },
  activeNavigatorText: {
    color: colors.fonts.PRIMARYFONT,
    fontWeight: typography.fontWeights.medium,
  },
  screenContainer: {
    flex: 1,
  },
});
