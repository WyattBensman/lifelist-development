import { StyleSheet, View } from "react-native";
import LifeListLogo from "../Icons/LifeListLogo";
import CreateCollageIcon from "../Icons/CreateCollageIcon";
import LogbookIcon from "../Icons/LogbookIcon";
import InboxIcon from "../Icons/InboxIcon";

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
