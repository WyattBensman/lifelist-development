import { StyleSheet } from "react-native";

export const authenticationStyles = StyleSheet.create({
  // === Authentication Styles === //
  stepTitle: {
    color: "#6AB952",
    fontWeight: "700",
    fontSize: 16,
    marginBottom: 4,
    textAlign: "left",
    width: "80%",
  },
  mainTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
    width: "80%",
    marginBottom: 8,
  },
  subtitle: {
    color: "#696969",
    fontSize: 14,
    textAlign: "left",
    width: "80%",
    marginBottom: 24,
  },

  // Sign Up & Login
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  mainLogo: {
    width: 60,
    height: 52,
    marginBottom: 16,
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    color: "#c7c7c7",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 32,
    marginHorizontal: 42,
  },
  inputWrapper: {
    width: "85%",
    marginBottom: 16,
  },
  orText: {
    color: "#696969",
    marginVertical: 12,
  },
  socialIconsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "50%",
  },
  socialIcon: {
    width: 48,
    height: 48,
    borderRadius: 4,
    backgroundColor: "#252525",
    justifyContent: "center",
    alignItems: "center",
  },
  googleImage: {
    width: 40,
    height: 40,
  },
  facebookImage: {
    width: 46,
    height: 46,
  },
  appleImage: {
    width: 22,
    height: 26,
    marginBottom: 2,
  },
  signInText: {
    color: "#c7c7c7",
    fontSize: 12,
    marginTop: 48,
  },
  signInLink: {
    color: "#6AB952",
    fontWeight: "700",
  },
  switchText: {
    color: "#696969",
    fontSize: 12,
  },
  switchTypeText: {
    color: "#6AB952",
    fontSize: 12,
    fontWeight: "700",
  },
  greenButton: {
    backgroundColor: "#6AB95230",
    borderColor: "#6AB95250",
    textColor: "#6AB952",
  },
  disabledButton: {
    backgroundColor: "#1c1c1c",
    borderColor: "#1c1c1c",
    textColor: "#696969",
  },

  // Login & Profile Informtion
  topContainer: {
    alignItems: "center",
    marginTop: -4,
  },
  stepIndicator: {
    color: "#6AB952",
    marginBottom: 8,
  },
  progressBarContainer: {
    width: "80%",
    height: 4,
    flexDirection: "row",
    marginBottom: 24,
  },
  progressBarQuarterFill: {
    flex: 0.25,
    backgroundColor: "#6AB952",
    borderRadius: 4,
  },
  progressBarQuarterEmpty: {
    flex: 0.75,
    backgroundColor: "#1c1c1c",
  },
  middleContainer: {
    alignItems: "center",
    width: "100%",
    marginBottom: 84,
  },
  stepTitle: {
    color: "#6AB952",
    fontWeight: "700",
    fontSize: 16,
    marginBottom: 4,
    width: "80%",
  },
  mainTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
    width: "80%",
    marginBottom: 8,
  },
  subtitle: {
    color: "#696969",
    fontSize: 14,
    textAlign: "left",
    width: "80%",
    marginBottom: 24,
  },
  bottomContainer: {
    alignItems: "center",
    marginBottom: 64,
  },
  bottomlogo: {
    width: 48,
    height: 41.6,
  },
});

export default authenticationStyles;
