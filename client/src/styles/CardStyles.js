import { StyleSheet } from "react-native";

export const cardStyles = StyleSheet.create({
  /* CARD CONTAINERS */
  userCardContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 2,
    marginBottom: 8,
  },
  logbookCardContainer: {
    flex: 1,
    padding: 12,
    marginBottom: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "rgba(212, 212, 212, 0.50)",
  },
  experienceCardContainerMd: {
    width: 130,
    marginRight: 6,
    borderRadius: 4,
    overflow: "hidden",
  },
  experienceCardContainerLg: {
    width: 165,
    overflow: "hidden",
    marginRight: 6,
  },
  experienceListCardContainer: {
    marginHorizontal: 8,
    marginBottom: 8,
  },
  privacyGroupCard: {
    marginTop: 16,
    padding: 16,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: "#d4d4d4",
  },
  entryCardContainer: {
    padding: 16,
    paddingBottom: 12,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#d4d4d4",
  },
  /* IMAGE */
  imageSm: {
    height: 35,
    width: 35,
    borderRadius: 4,
    marginRight: 6,
  },
  imageMd: {
    height: 50,
    width: 50,
    borderRadius: 4,
    marginRight: 6,
  },
  imageExperienceMd: {
    height: 170,
    width: "100%",
    borderRadius: 4,
  },
  imageExperienceLg: {
    height: 220,
    width: "100%",
    borderRadius: 6,
    marginBottom: 4,
  },
  /* DELETE THIS DOWN THE ROAD? */
  flexRowCenter: {
    flexDirection: "row",
    alignItems: "center",
  },
  /* TEXT */
  primaryText: {
    fontWeight: "500",
  },
  primaryTextSm: {
    fontWeight: "500",
    fontSize: 12,
  },
  secondaryText: {
    fontSize: 12,
    color: "#d4d4d4",
  },
  secondaryTextSm: {
    fontSize: 10,
    marginTop: 4,
  },
  messageText: {
    marginRight: 8,
    flexShrink: 1,
  },
  /* SPACER */
  leftSpacer: {
    marginLeft: 4,
  },
  readMore: {
    marginTop: 8,
    fontSize: 12,
    color: "#6AB952",
    textAlign: "center",
  },
});
