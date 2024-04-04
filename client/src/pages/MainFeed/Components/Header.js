import { StyleSheet, View } from "react-native";
import CreateCollageIcon from "../../../icons/MainFeed/CreateCollageIcon";
import LogbookIcon from "../../../icons/MainFeed/LogbookIcon";
import InboxIcon from "../../../icons/MainFeed/InboxIcon";
import LifeListLogo from "../../../icons/MainFeed/LifeListLogo";

export default function Header() {
  return (
    <View style={styles.mainContainer}>
      <View style={styles.contentContainer}>
        <LifeListLogo />
        <View style={styles.btnContainer}>
          <CreateCollageIcon style={styles.iconSpacing} />
          <LogbookIcon style={styles.iconSpacing} />
          <InboxIcon style={styles.iconSpacing} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    marginTop: 45,
    paddingTop: 10,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#D4D4D4",
  },
  contentContainer: {
    marginHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  btnContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    fontSize: 24,
  },
  iconSpacing: {
    marginLeft: 18,
    marginTop: 5,
  },
});
