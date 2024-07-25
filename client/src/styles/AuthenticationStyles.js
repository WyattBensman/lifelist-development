import { StyleSheet } from "react-native";

export const authenticationStyles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 64,
    margin: 32,
  },
  formContainer: {
    flex: 1,
    justifyContent: "space-between",
    margin: 32,
  },
  codeContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 32,
    marginBottom: 16,
    marginHorizontal: 32,
  },
  codeInput: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: "#d4d4d4",
    textAlign: "center",
    fontSize: 16,
  },
  iconLarge: {
    width: 80,
    height: 80,
    alignSelf: "center",
  },
  iconSmall: {
    width: 40,
    height: 40,
    alignSelf: "center",
    marginBottom: 8,
  },
  profilePictureContainer: {
    height: 75,
    width: 75,
    borderRadius: 4,
    alignSelf: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
    color: "#ffffff",
  },
  subheader: {
    fontWeight: "500",
    textAlign: "center",
    fontStyle: "italic",
    color: "#6AB952",
    marginBottom: 16,
    marginTop: 8,
  },
  smallText: {
    fontSize: 10,
    textAlign: "center",
    margin: 32,
  },
});
