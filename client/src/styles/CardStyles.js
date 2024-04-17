import { StyleSheet } from "react-native";

export const cardStyles = StyleSheet.create({
  /* CARD CONTAINERS */
  userCardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 8,
    marginBottom: 8,
  },
  experienceCardContainerMd: {
    width: 130,
    marginRight: 6,
    borderRadius: 4,
    overflow: "hidden",
  },
  /* IMAGES */
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
  /* LOGBOOK */
  logbookCardContainer: {
    padding: 12,
    marginBottom: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "rgba(212, 212, 212, 0.50)",
  },
  /* SPACER */
  bottomSpacer: {
    marginBottom: 4,
  },
});
